"use client";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        router.push(newValue);
    };

    return (
        <Box sx={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)", mb: 4, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 1000 }}>
            <Container maxWidth="lg">
                <Tabs value={pathname === "/priority" ? "/priority" : "/"} onChange={handleChange} 
                    sx={{ 
                        "& .MuiTabs-indicator": { backgroundColor: "#ff4d6d", height: 3, borderRadius: "3px 3px 0 0" },
                        "& .MuiTab-root": { 
                            color: "rgba(255,255,255,0.6)", 
                            fontWeight: 600, 
                            fontSize: "1.1rem",
                            transition: "all 0.3s", 
                            textTransform: "none",
                            minHeight: "64px",
                            px: 4,
                            "&.Mui-selected": { 
                                color: "#fff", 
                            } 
                        } 
                    }}>
                    <Tab value="/" label="All Notifications" />
                    <Tab value="/priority" label="⭐ Priority Inbox" />
                </Tabs>
            </Container>
        </Box>
    );
}
