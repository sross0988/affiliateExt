import * as React from 'react';
import { styled } from '@mui/material/styles';
import { CirclePicker } from 'react-color';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box, { BoxProps as MuiBoxProps } from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import useLocalStorage from './useLocalStorage';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import StatList from './StatList';
import TableChartList from './TableChartList';
import { ListSubheader, Tooltip } from '@mui/material';

const drawerWidth = 390;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const SpinningIcon = styled(RefreshIcon)(({ isLoading }: {
    isLoading: boolean;
}) => ({
    animation: isLoading ? 'spin 1s linear infinite' : 'none',
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
}));

interface AppBarProps extends MuiAppBarProps {
    drawerOpen?: boolean;
}


interface BoxProps extends MuiBoxProps {
    drawerOpen?: boolean;
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<AppBarProps>(({ theme, drawerOpen }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(drawerOpen && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const MainContentBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<BoxProps>(({ theme, drawerOpen }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(drawerOpen && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function PrimarySearchAppBar({
    children,
    stats,
    setStats,
    tablesCharts,
    setTablesCharts,
    setPrimaryColor,
    primaryColor,
    setDarkMode,
    darkMode,
    refresh,
    isRefreshing
}: {
    children: React.ReactNode;
    stats: string[];
    setStats: (stats: string[]) => void;
    tablesCharts: string[];
    setTablesCharts: (tablesCharts: string[]) => void;
    setPrimaryColor: (color: string) => void;
    primaryColor: string;
    setDarkMode: (darkMode: boolean) => void;
    darkMode: boolean;
    refresh: () => void;
    isRefreshing: boolean;

}) {
    const [hideData, setHideData] = useLocalStorage('hideData', false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" drawerOpen={drawerOpen}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Reports
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>
                        <Tooltip
                            title="Refresh data"
                        >
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="Refresh data"
                                aria-haspopup="true"
                                onClick={() => refresh()}
                                color="inherit"
                            >
                                <SpinningIcon isLoading={isRefreshing} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={hideData ? 'Show data' : 'Hide data'}
                        >

                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="display settings"
                                aria-haspopup="true"
                                onClick={() => setHideData(!hideData)}
                                color="inherit"
                            >
                                {hideData ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Settings"
                        >
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="display settings"
                                aria-haspopup="true"
                                onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
                                color="inherit"
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="right"
                open={drawerOpen}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Box
                    display="flex"
                    justifyContent={"flex-end"}
                >
                    <FormGroup>
                        <FormControlLabel control={<Switch
                            checked={hideData}
                            onChange={() => setHideData(!hideData)}
                        />} label="Hide data" />
                    </FormGroup>
                </Box>
                <Divider />
                <StatList stats={stats} setStats={setStats} />
                <Divider />
                <TableChartList tablesCharts={tablesCharts} setTablesCharts={setTablesCharts} />
                <Divider />
                <ListSubheader sx={{
                    lineHeight: '24px',
                    fontWeight: 700,
                    textAlign: 'left',
                    marginTop: '1rem',
                }}>Theme</ListSubheader>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1rem',
                    }}
                >
                    <CirclePicker
                        colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
                        color={primaryColor}
                        onChangeComplete={(color) => {
                            setPrimaryColor(color.hex);
                        }}
                    />

                </Box>
                <Box
                    sx={{
                        margin: '1rem',
                    }}
                >
                    <FormGroup>
                        <FormControlLabel
                            control={<MaterialUISwitch
                                sx={{ m: 1 }}
                                checked={darkMode}
                                onChange={() => {
                                    setDarkMode(!darkMode)
                                }
                                }
                            />}
                            label="Dark mode"
                        />
                    </FormGroup>
                </Box>
            </Drawer>
            <MainContentBox drawerOpen={drawerOpen}>
                {hideData ? null : children}
            </MainContentBox>
        </Box>
    );
}