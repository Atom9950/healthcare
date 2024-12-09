'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!, 
            APPOINTMENT_COLLECTION_ID!, 
            ID.unique(), 
            appointment
        );
        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
        throw new Error("Database or Collection ID is not defined");
    }

    if (!appointmentId || appointmentId.trim() === '') {
        throw new Error("Invalid appointment ID");
    }

    try {
        const appointment = await databases.getDocument(
            DATABASE_ID,
            APPOINTMENT_COLLECTION_ID,
            appointmentId.trim()
        );

        return parseStringify(appointment);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        throw new Error("Failed to fetch appointment");
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!, 
            APPOINTMENT_COLLECTION_ID!, 
            [Query.orderDesc("$createdAt")]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };

        return parseStringify(data);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the recent appointments:",
            error
        );
        throw error;
    }
};

export const updateAppointment = async ({
    appointmentId,
    userId,
    timeZone,
    appointment,
    type,
  }: UpdateAppointmentParams) => {
    try {
      const updatedAppointment = await databases.updateDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
        appointment
      );
  
      if (!updatedAppointment) throw Error;
  
      
  
      revalidatePath("/admin");
      return parseStringify(updatedAppointment);
    } catch (error) {
      console.error("An error occurred while scheduling an appointment:", error);
    }
  }


  