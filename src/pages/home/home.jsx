import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ItemGroup from "../../components/item-group/item-group";
import { Outlet } from "react-router-dom";

export default function Home() {
  const cards = [
    // { title: "Dự án A", desc: "Tài liệu về dự án A" },
    // { title: "Dự án B", desc: "Tài liệu về dự án B" },
    // { title: "Dự án C", desc: "Tài liệu về dự án C" },
    { id: 1, title: "Nhóm 1", subheader: "Nguyễn Văn A" },
    { id: 2, title: "Nhóm 2", subheader: "Trần Thị B" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
      {/* {cards.map((card, index) => (
        <Card key={index} sx={{ borderRadius: 3, background: "#fff" }}>
          <CardContent>
            <Typography variant="h6">{card.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {card.desc}
            </Typography>
          </CardContent>
        </Card>
      ))} */}
      {cards.map((card) => (
        // <ItemGroup key={index} title={card.title} desc={card.desc} />
        <ItemGroup key={card.id} id={card.id} title={card.title} subheader={card.subheader} />
      ))}


      {/* Khu vực hiển thị chi tiết */}
      <div style={{ flex: 2, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
