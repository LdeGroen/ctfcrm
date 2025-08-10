import { Query } from 'https://esm.sh/appwrite@14.0.1';
import { APPWRITE_DATABASE_ID } from './config';

export const fetchAllDocuments = async (databases, collectionId) => {
    const documents = [];
    let fetchedDocuments = [];
    let offset = 0;
    const limit = 100;

    try {
        do {
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                collectionId,
                [Query.limit(limit), Query.offset(offset)]
            );
            fetchedDocuments = response.documents;
            documents.push(...fetchedDocuments);
            offset += limit;
        } while (fetchedDocuments.length > 0);
        
        return documents;
    } catch (e) {
        console.error(`Fout bij ophalen van alle documenten voor ${collectionId}:`, e);
        try {
            // Fallback for smaller collections or if pagination fails
            const response = await databases.listDocuments(APPWRITE_DATABASE_ID, collectionId, [Query.limit(500)]);
            return response.documents;
        } catch (fallbackError) {
            console.error(`Fallback voor ${collectionId} ook mislukt:`, fallbackError);
            return [];
        }
    }
};
