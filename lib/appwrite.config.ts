import * as sdk from 'node-appwrite';

// Validate environment variables
const requiredEnvVars = [
  'PROJECT_ID', 
  'API_KEY', 
  'DATABASE_ID', 
  'PATIENT_COLLECTION_ID', 
  'DOCTOR_COLLECTION_ID', 
  'APPOINTMENT_COLLECTION_ID', 
  'NEXT_PUBLIC_BUCKET_ID', 
  'NEXT_PUBLIC_ENDPOINT'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const {
  PROJECT_ID, 
  API_KEY, 
  DATABASE_ID, 
  PATIENT_COLLECTION_ID, 
  DOCTOR_COLLECTION_ID, 
  APPOINTMENT_COLLECTION_ID, 
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client = new sdk.Client();

// Remove non-null assertions and add null checks
if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  throw new Error('Appwrite configuration is incomplete');
}

client
.setEndpoint(ENDPOINT)
.setProject(PROJECT_ID)
.setKey(API_KEY);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);