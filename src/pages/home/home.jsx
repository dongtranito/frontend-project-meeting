// import React from "react";
// import { Card, CardContent, Typography } from "@mui/material";
// import ItemGroup from "../../components/item-group/item-group";
// import { Outlet } from "react-router-dom";

// export default function Home() {
//   const cards = [
//     // { title: "Dự án A", desc: "Tài liệu về dự án A" },
//     // { title: "Dự án B", desc: "Tài liệu về dự án B" },
//     // { title: "Dự án C", desc: "Tài liệu về dự án C" },
//     { id: 1, title: "Nhóm 1", subheader: "Nguyễn Văn A" },
//     { id: 2, title: "Nhóm 2", subheader: "Trần Thị B" },
//   ];

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
//       {/* {cards.map((card, index) => (
//         <Card key={index} sx={{ borderRadius: 3, background: "#fff" }}>
//           <CardContent>
//             <Typography variant="h6">{card.title}</Typography>
//             <Typography variant="body2" color="text.secondary">
//               {card.desc}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))} */}
//       {cards.map((card) => (
//         // <ItemGroup key={index} title={card.title} desc={card.desc} />
//         <ItemGroup key={card.id} id={card.id} title={card.title} subheader={card.subheader} />
//       ))}


//       {/* Khu vực hiển thị chi tiết */}
//       <div style={{ flex: 2, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// import React, { useContext, useEffect, useState } from "react";
// import ItemGroup from "../../components/item-group/item-group";
// import { Outlet } from "react-router-dom";
// import { CircularProgress, Typography } from "@mui/material";
// import { AuthContext } from "../../auth/auth-context";

// export default function Home() {
//   const { user } = useContext(AuthContext); // ✅ Lấy token từ context
//   const [ownedGroups, setOwnedGroups] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGroups = async () => {
//       if (!user?.token) {
//         console.warn("⚠️ Không có token, không gọi API.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch("http://localhost:3001/get-list-group", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`, // 🔥 gửi token xác thực
//           },
//         });

//         const data = await res.json();

//         if (!res.ok || !data.success) {
//           throw new Error(data.message || "Không thể tải danh sách nhóm");
//         }

//         console.log("✅ Nhóm nhận được:", data.data);

//         setOwnedGroups(data.data.ownedGroups || []);
//         setJoinedGroups(data.data.joinedGroups || []);
//       } catch (err) {
//         console.error("❌ Lỗi khi lấy danh sách nhóm:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroups();
//   }, [user]);

//   if (loading)
//     return (
//       <div style={{ textAlign: "center", marginTop: 50 }}>
//         <CircularProgress />
//         <Typography variant="body2" color="text.secondary" mt={2}>
//           Đang tải danh sách nhóm...
//         </Typography>
//       </div>
//     );

//   if (error)
//     return (
//       <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
//         {error}
//       </Typography>
//     );

//   // ✅ Kết hợp nhóm sở hữu và nhóm đã tham gia
//   // const allGroups = [...ownedGroups, ...joinedGroups];
//   // Sau khi fetch API xong:
//   const allGroups = [
//     ...ownedGroups.map((g) => ({ ...g, _key: `owned-${g.groupId}` })),
//     ...joinedGroups.map((g) => ({ ...g, _key: `joined-${g.groupId}` })),
//   ];


//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "16px",
//         padding: "16px",
//       }}
//     >
//       {allGroups.length > 0 ? (
//         allGroups.map((group) => (
//           <ItemGroup
//             key={group._key}
//             id={group.groupId}
//             title={group.name}
//             subheader={group.owner_id}
//             description={group.description}
//           />
//         ))
//       ) : (
//         <Typography variant="body2" color="text.secondary" sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
//           Bạn chưa có nhóm nào.
//         </Typography>
//       )}

//       {/* Khu vực hiển thị chi tiết */}
//       <div style={{ flex: 2, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }


import React, { useContext, useEffect, useState, useCallback } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { GroupContext } from "../../context/group-context";
import ItemGroup from './../../components/item-group/item-group';
import Header from './../../components/header/header';

export default function Home() {
  const { ownedGroups, joinedGroups, fetchGroups, loading, error } =
    useContext(GroupContext);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const allGroups = [
    ...ownedGroups.map((g) => ({ ...g, _key: `owned-${g.groupId}` })),
    ...joinedGroups.map((g) => ({ ...g, _key: `joined-${g.groupId}` })),
  ];

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Đang tải danh sách nhóm...
        </Typography>
      </div>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );

  return (
    <div>
      <Header onGroupCreated={fetchGroups} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          padding: "16px",
        }}
      >
        {allGroups.length > 0 ? (
          allGroups.map((group) => (
            <ItemGroup
              key={group._key}
              id={group.groupId}
              title={group.name}
              subheader={group.owner_id}
              description={group.description}
            />
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ gridColumn: "1 / -1", textAlign: "center" }}
          >
            Bạn chưa có nhóm nào.
          </Typography>
        )}
        <div style={{ flex: 2, paddingLeft: 20 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
