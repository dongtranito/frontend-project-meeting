import React from 'react'
import './detail-item-group.css'
import { Box, Button, Tab } from '@mui/material';
import { useParams } from "react-router-dom";

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InviteMemberDialog from './invite-member-dialog/invite-member-dialog';
import CreateMeetingDialog from './create-meeting-dialog/create-meeting-dialog';
import ChatBox from '../../components/chatbox/chatbox';

export default function DetailItemGroup() {
    const { id } = useParams();

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        // <div>
        //     <div style={{ padding: 20 }}>
        //         <h2>Chi tiết nhóm: {id}</h2>
        //         <p>Thông tin chi tiết của nhóm {id} này sẽ hiển thị ở đây.</p>
        //     </div>
        // </div>
        <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                        <Tab label="Thành viên" value="1" />
                        <Tab label="Cuộc họp" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div className="list-btn">
                        <h2>Danh sách thành viên: </h2>
                        <InviteMemberDialog />
                    </div>
                    <div className='list-members'>
                        Các member!
                    </div>
                </TabPanel>
                <TabPanel value="2" >
                    <div className="meeting-tab">
                        <div className="meeting-content">
                            <div className="list-btn">
                                <h2>Danh sách cuộc họp:</h2>
                                <CreateMeetingDialog />
                            </div>

                            {/* Nội dung khác */}
                        </div>

                        {/* Thanh chatbox */}
                        <div className="chatbox-wrapper">
                            <ChatBox />
                        </div>
                    </div>
                </TabPanel>

            </TabContext>
        </Box>
    )
}


