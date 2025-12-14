import React, { createContext, useState, useCallback, useContext } from "react";
import { AuthContext } from "../auth/auth-context";
import { API_URL } from "../config/api";


export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [ownedGroups, setOwnedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchGroups = useCallback(async () => {

        setLoading(true);
        setError("");

        try {
            // const res = await fetch("http://localhost:3001/get-list-group", {
            const res = await fetch(`${API_URL}/get-list-group`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${user.token}`,
                },
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Không thể tải danh sách nhóm");
            }

            console.log("Nhóm nhận được:", data.data);

            setOwnedGroups(data.data.ownedGroups || []);
            setJoinedGroups(data.data.joinedGroups || []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách nhóm:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    return (
        <GroupContext.Provider
            value={{
                ownedGroups,
                joinedGroups,
                fetchGroups,
                loading,
                error,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};
