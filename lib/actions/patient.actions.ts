'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import {InputFile} from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone,
            undefined,
            user.name
        );
        console.log({newUser})

        return parseStringify(newUser);
    } catch (error: any) {
        if(error && error?.code === 409){
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }
        console.error("An error occurred while creating a new user:", error);
    }
};

export const getUser = async (userID: string) =>{
    try {
        const user =await users.get(userID);

        return parseStringify(user);
        
    } catch (error) {
        console.log(error)
        
    }
}

export const getPatient = async (userID: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [ Query.equal('userid', userID) ] // Note: 'userid' exactly as in the schema
        );

        // If multiple documents exist, return the first one
        if (patients.documents.length > 0) {
            return parseStringify(patients.documents[0]);
        }
        
        return null;
    } catch (error) {
        console.error('Error in getPatient:', error);
        return null;
    }
}
export const registerPatient = async ({ identificationDocument, ...patient}:
    RegisterUserParams) => {
        try {
            let file;
            if(identificationDocument) {
                const inputFile = InputFile.fromBuffer(
                    identificationDocument?.get('blobFile') as Blob,
                    identificationDocument?.get('fileName') as string,
                )

                file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
            }

            const newPatient=await databases.createDocument(
                DATABASE_ID!,
                PATIENT_COLLECTION_ID!,
                ID.unique(),
                {
                    identificationDocumentId: file?.$id || null,
                    identificationDocumentUrl: file?.$id || `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                    ...patient,
                }
            )

            return parseStringify(newPatient);
        } catch (error) {
            console.error("An error occurred while creating a new patient:", error);

        }
    }
