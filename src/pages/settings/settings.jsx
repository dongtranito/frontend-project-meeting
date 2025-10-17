import React from "react";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";

export default function Settings() {
  
  return (
    <div >
      <Card sx={{ width: '100%' }}>
      <CardHeader className="item-group-container-header" 
        title="Thông báo"
      />
      <Divider />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Các cài đặt thông báo!!
        </Typography>
      </CardContent>
    </Card>
    </div>
  );
}
