import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AuthContext } from "../../auth/auth-context";

import InviteMemberDialog from './invite-member-dialog/invite-member-dialog';
import CreateMeetingDialog from './create-meeting-dialog/create-meeting-dialog';
import MemberItem from "./item-member/item-member";
import './detail-item-group.css';
import MeetingItem from "./item-meeting/item-meeting";
import FloatingChatStream from "../../components/floating-chatbot/floating-chatbot";
import { API_URL } from "../../config/api.js";
import Header from "../../components/header/header.jsx";


export default function DetailItemGroup() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(true);
  const [groupDetail, setGroupDetail] = useState(null);
  const [error, setError] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchGroupDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // const res = await fetch(`http://localhost:3001/detail-group/${id}`, {
      const res = await fetch(`${API_URL}/detail-group/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Không thể tải thông tin nhóm");

      setGroupDetail(data.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết nhóm:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setGroupDetail(null);
    setMeetings([]);
    setError("");
    setLoading(true);
    setLoadingMeetings(false);
    setValue("1");

    fetchGroupDetail();
  }, [id, user]);

  useEffect(() => {
    if (value === "2" && id) {
      fetchMeetings();
    }
  }, [value, id]);

  const fetchMeetings = async () => {
    if (!id) return;
    setLoadingMeetings(true);
    try {
      // const res = await fetch(`http://localhost:3001/get-list-meeting?groupId=${id}`,
      const res = await fetch(`${API_URL}/get-list-meeting?groupId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token || ""}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Không thể tải danh sách cuộc họp");

      setMeetings(data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải cuộc họp:", err);
      setMeetings([]);
    } finally {
      setLoadingMeetings(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Đang tải thông tin nhóm...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );

  if (!groupDetail)
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
        Không tìm thấy thông tin nhóm.
      </Typography>
    );

  console.log("📘 groupDetail nhận được từ backend:", groupDetail);

  return (
    <Box sx={{ width: "100%", typography: "body1", height: "100%" }}>
      <Box sx={{ mb: 2, borderBottom: "1px solid #ddd"}}>
        {/* <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {groupDetail.name}
        </Typography> */}
        <Header title={groupDetail?.name || "Chi tiết nhóm"} />

        <Typography variant="body2" color="text.secondary" className="sub-detail-group">
          Chủ nhóm: {groupDetail.owner_id || "Không xác định"}
        </Typography>
      </Box>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Thành viên" value="1" />
            <Tab label="Cuộc họp" value="2" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <div className="list-btn">
            <h2>Danh sách thành viên:</h2>
            <InviteMemberDialog groupId={id} refreshGroup={fetchGroupDetail} />
          </div>

          <div className="list-members">
            {groupDetail.members?.length > 0 ? (
              groupDetail.members.map((member, index) => {
                const isOwner =
                  groupDetail.members.some(
                    (m) => m.user_id === user?.email && m.role === "owner"
                  ) || groupDetail.owner_id === user?.email;

                return (
                  <MemberItem
                    key={index}
                    member={member}
                    groupId={id}
                    isOwner={isOwner}
                    currentUserEmail={user?.email}
                    token={user?.token}
                    onRemoved={() => {
                      setGroupDetail((prev) => ({
                        ...prev,
                        members: prev.members.filter((m) => m.user_id !== member.user_id),
                      }));
                    }}
                    onUpdated={(updatedMember) => {
                      setGroupDetail((prev) => ({
                        ...prev,
                        members: prev.members.map((m) =>
                          m.user_id === updatedMember.user_id ? updatedMember : m
                        ),
                      }));
                    }}
                  />

                );
              })
            ) : (
              <Typography color="text.secondary">
                Chưa có thành viên nào.
              </Typography>
            )}
          </div>
        </TabPanel>

        <TabPanel value="2">
          <div className="meeting-tab">
            <div className="meeting-content">
              <div className="list-btn">
                <h2>Danh sách cuộc họp:</h2>
                <CreateMeetingDialog groupId={id} onCreated={fetchMeetings} />
              </div>

              {loadingMeetings ? (
                <CircularProgress />
              ) : meetings.length > 0 ? (
                // meetings.map((meeting) => (
                //   <MeetingItem key={meeting.meetingId} meeting={meeting} />
                // ))
                meetings.map((meeting) => (
                  <MeetingItem
                    key={meeting.meetingId}
                    meeting={meeting}
                    onDeleted={(deletedId) => {
                      setMeetings((prev) => prev.filter((m) => m.meetingId !== deletedId));
                    }}
                    onUpdated={(updatedMeeting) => {
                      setMeetings((prev) =>
                        prev.map((m) =>
                          m.meetingId === updatedMeeting.meetingId ? updatedMeeting : m
                        )
                      );
                    }}
                  />
                ))

              ) : (
                <Typography color="text.secondary">
                  Chưa có cuộc họp nào.
                </Typography>
              )}
            </div>

            <FloatingChatStream groupId={id} />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

