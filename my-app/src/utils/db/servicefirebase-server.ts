import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    addDoc,
    where,
    updateDoc,
    orderBy,
    limit
} from "firebase/firestore";
import { getDatabase, ref as rtdbRef, get as getRTDB } from "firebase/database";
import app, { isFirebaseConfigured } from "./firebase";
import bcrypt from "bcryptjs";

const db = getFirestore(app);
export { db };

// Fungsi Sign In untuk Next-Auth Credentials
export async function signIn(email: string) {
    if (!isFirebaseConfigured) {
        return null;
    }

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return data.length > 0 ? data[0] : null;
}

// Fungsi Sign Up (Register Akun Baru)
export async function signUp(userData: any, callback: Function) {
    if (!isFirebaseConfigured) {
        return callback({ status: false, message: "Firebase belum dikonfigurasi" });
    }

    const q = query(collection(db, "users"), where("email", "==", userData.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return callback({ status: false, message: "Email sudah terdaftar" });
    }

    // Hash password & set default data
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.role = "member";
    userData.createdAt = new Date().toISOString();

    try {
        await addDoc(collection(db, "users"), userData);
        callback({ status: true, message: "Registrasi Berhasil" });
    } catch (error: any) {
        callback({ status: false, message: error.message });
    }
}

// Fungsi Login/Register otomatis via Google OAuth
export async function loginWithOAuth(userData: any, callback: any) {
    try {
        if (!isFirebaseConfigured) {
            return callback({
                status: false,
                message: "Firebase belum dikonfigurasi",
            });
        }

        const q = query(collection(db, "users"), where("email", "==", userData.email));
        const querySnapshot = await getDocs(q);
        const data: any = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data.length > 0) {
            // User lama: update data tanpa ganti role
            userData.role = data[0].role;
            await updateDoc(doc(db, "users", data[0].id), userData);
            callback({
                status: true,
                message: "Login Google Berhasil",
                data: userData,
            });
        } else {
            // User baru: simpan sebagai member
            userData.role = "member";
            userData.createdAt = new Date().toISOString();
            await addDoc(collection(db, "users"), userData);
            callback({
                status: true,
                message: "Register Google Berhasil",
                data: userData,
            });
        }
    } catch (error: any) {
        callback({
            status: false,
            message: "Gagal memproses data Google",
        });
    }
}

// BAGIAN SINKRONISASI SENSOR (RTDB ke Firestore)
export const rtdb = getDatabase(app);

// Normalisasi pumpStatus
function normalizePumpStatus(value: any): string {
    if (typeof value === "boolean") {
        return value ? "AKTIF" : "NONAKTIF";
    }

    if (typeof value === "string") {
        const v = value.trim().toUpperCase();
        if (["AKTIF", "ON", "TRUE", "1"].includes(v)) return "AKTIF";
        return "NONAKTIF";
    }

    if (typeof value === "number") {
        return value === 1 ? "AKTIF" : "NONAKTIF";
    }

    return "NONAKTIF";
}

// Ambil data RTDB terbaru lalu simpan ke Firestore
export async function syncLatestSensorDataFromRTDB(
    rtdbPath: string = "/"
) {
    try {
        // Ambil data RTDB
        const snapshot = await getRTDB(rtdbRef(rtdb, rtdbPath));

        if (!snapshot.exists()) {
            return {
                status: false,
                message: "Data RTDB tidak ditemukan",
            };
        }

        const rawData = snapshot.val();

        // Ambil data terakhir Firestore
        const q = query(
            collection(db, "sensorData"),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        const lastSnapshot = await getDocs(q);

        const now = new Date();

        // Cek apakah sudah 5 menit
        if (!lastSnapshot.empty) {
            const lastDoc = lastSnapshot.docs[0].data();

            const lastTimestamp = lastDoc.timestamp?.toDate();

            if (lastTimestamp) {
                const diffMs = now.getTime() - lastTimestamp.getTime();

                // 5 menit = 300000 ms
                const fiveMinutes = 5 * 60 * 1000;

                if (diffMs < fiveMinutes) {
                    return {
                        status: false,
                        message: "Belum 5 menit sejak snapshot terakhir",
                    };
                }
            }
        }

        // ==========================
        // Data yang disimpan
        // ==========================
        const firestoreSensorData = {
            humidity: Number(rawData?.humidity ?? 0),
            pumpStatus: normalizePumpStatus(rawData?.pumpStatus),
            soilMoisture: Number(rawData?.soilMoisture ?? 0),
            temperature: Number(rawData?.temperature ?? 0),
            timestamp: now,
        };

        // ==========================
        // Simpan ke Firestore
        // ==========================
        const docRef = await addDoc(
            collection(db, "sensorData"),
            firestoreSensorData
        );

        return {
            status: true,
            message: "Snapshot sensor berhasil disimpan",
            id: docRef.id,
            data: firestoreSensorData,
        };
    } catch (error: any) {
        console.error("Error sync sensor data:", error);

        return {
            status: false,
            message: error.message || "Gagal sinkron data sensor",
        };
    }
}