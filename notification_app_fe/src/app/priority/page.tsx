"use client";
import { useEffect, useState } from "react";
import {
    Box, Typography, Chip, Card, CardContent, MenuItem,
    Select, FormControl, CircularProgress, Container, Fade
} from "@mui/material";
import { fetchNotifications, getTopN, Notification } from "../../lib/api";
import { useViewedNotifications } from "../../lib/useViewedNotifications";

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
    Placement: { color: "#ffffff", bg: "linear-gradient(135deg, #FF6B6B 0%, #C0392B 100%)", icon: "💼" },
    Result: { color: "#ffffff", bg: "linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)", icon: "📊" },
    Event: { color: "#ffffff", bg: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)", icon: "🎯" },
};

export default function PriorityInbox() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [topN, setTopN] = useState(10);
    const [filterType, setFilterType] = useState("");
    const { viewed, markViewed, isLoaded } = useViewedNotifications();

    useEffect(() => { loadNotifications(); }, [filterType]);

    async function loadNotifications() {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filterType) params.notification_type = filterType;
            const data = await fetchNotifications(params);
            setNotifications(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    const unviewedCount = notifications.filter((n) => !viewed.has(n.ID)).length;
    const displayed = getTopN(notifications, topN, viewed);

    if (!isLoaded) return null;

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #090914 0%, #16162c 50%, #060c14 100%)", pb: 6, color: "#fff" }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6, textAlign: "center" }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", mb: 2, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                        ⭐ Priority Inbox
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1.3rem", fontWeight: 400 }}>
                        Your top {topN} most important notifications
                    </Typography>
                </Box>

                {/* Stats Row */}
                <Box sx={{ display: "flex", gap: 3, mb: 6, justifyContent: "center", flexWrap: "wrap" }}>
                    <Box sx={{ 
                        background: "linear-gradient(135deg, rgba(255,77,109,0.1) 0%, rgba(255,77,109,0.05) 100%)", 
                        borderRadius: 4, 
                        px: 4, 
                        py: 2, 
                        textAlign: "center", 
                        backdropFilter: "blur(12px)", 
                        border: "1px solid rgba(255,77,109,0.3)",
                        boxShadow: "0 8px 32px rgba(255,77,109,0.1)",
                        minWidth: "140px"
                    }}>
                        <Typography sx={{ color: "#ff4d6d", fontWeight: 800, fontSize: "2.5rem" }}>{unviewedCount}</Typography>
                        <Typography sx={{ color: "rgba(255,77,109,0.8)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Unread</Typography>
                    </Box>
                </Box>

                {/* Controls */}
                <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
                    <FormControl size="medium">
                        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                            displayEmpty
                            sx={{ 
                                color: "#fff", 
                                background: "rgba(255,255,255,0.05)", 
                                borderRadius: 3, 
                                fontSize: "1.2rem",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }, 
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                "& .MuiSvgIcon-root": { color: "#fff" }, 
                                minWidth: 240 
                            }}>
                            <MenuItem value="" sx={{ fontSize: "1.2rem" }}>All Types</MenuItem>
                            <MenuItem value="Placement" sx={{ fontSize: "1.2rem" }}>💼 Placement</MenuItem>
                            <MenuItem value="Result" sx={{ fontSize: "1.2rem" }}>📊 Result</MenuItem>
                            <MenuItem value="Event" sx={{ fontSize: "1.2rem" }}>🎯 Event</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem", fontWeight: 500 }}>Show top:</Typography>
                        <FormControl size="medium">
                            <Select value={topN} onChange={(e) => setTopN(Number(e.target.value))}
                                sx={{ 
                                    color: "#fff", 
                                    background: "rgba(255,255,255,0.05)", 
                                    borderRadius: 3, 
                                    fontSize: "1.2rem",
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }, 
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    "& .MuiSvgIcon-root": { color: "#fff" } 
                                }}>
                                {[10, 15, 20].map((n) => <MenuItem key={n} value={n} sx={{ fontSize: "1.2rem" }}>{n}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Notifications */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                        <CircularProgress size={60} sx={{ color: "#ff4d6d" }} />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {displayed.map((n, i) => {
                            const cfg = TYPE_CONFIG[n.Type] || TYPE_CONFIG.Event;
                            const isNew = !viewed.has(n.ID);
                            return (
                                <Fade in={true} key={n.ID} timeout={500 + Math.min(i * 50, 1000)}>
                                    <Card onClick={() => markViewed(n.ID)}
                                        sx={{ 
                                            cursor: "pointer", 
                                            background: isNew ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", 
                                            backdropFilter: "blur(16px)", 
                                            border: isNew ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.04)", 
                                            borderRadius: 4, 
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                                            "&:hover": { 
                                                transform: "translateY(-4px)", 
                                                background: isNew ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", 
                                                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                                                borderColor: "rgba(255,255,255,0.2)"
                                            } 
                                        }}>
                                        <CardContent sx={{ py: "24px !important", px: 4 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, flex: 1 }}>
                                                    <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "1.4rem", fontWeight: 900, minWidth: 32, pt: 0.5 }}>
                                                        #{i + 1}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                                            <Chip label={`${cfg.icon} ${n.Type}`} 
                                                                sx={{ 
                                                                    background: cfg.bg, 
                                                                    color: cfg.color, 
                                                                    fontWeight: 800, 
                                                                    fontSize: "1rem", 
                                                                    border: "none",
                                                                    py: 0.5,
                                                                    px: 1,
                                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                                                }} 
                                                            />
                                                            {isNew && <Chip label="NEW" sx={{ background: "#ff4d6d", color: "#fff", fontWeight: 800, fontSize: "0.9rem", height: 28, px: 1, boxShadow: "0 4px 12px rgba(255,77,109,0.3)" }} />}
                                                        </Box>
                                                        <Typography sx={{ color: isNew ? "#fff" : "rgba(255,255,255,0.7)", fontSize: "1.4rem", lineHeight: 1.6, fontWeight: isNew ? 600 : 400 }}>
                                                            {n.Message}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "1.1rem", whiteSpace: "nowrap", pt: { xs: 0, sm: 1 }, fontWeight: 500 }}>
                                                    {new Date(n.Timestamp).toLocaleString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric', 
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            );
                        })}
                        {displayed.length === 0 && !loading && (
                            <Box sx={{ textAlign: "center", py: 8 }}>
                                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "1.4rem" }}>
                                    No priority notifications found.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
