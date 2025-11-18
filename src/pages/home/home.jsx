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
              reload={fetchGroups}
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
