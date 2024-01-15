import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box, { BoxProps as MuiBoxProps } from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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

const drawerWidth = 440;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface AppBarProps extends MuiAppBarProps {
    drawerOpen?: boolean;
}


interface BoxProps extends MuiBoxProps {
    drawerOpen?: boolean;
}

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

export default function PrimarySearchAppBar({ children, stats, setStats }: {
    children: React.ReactNode;
    stats: string[];
    setStats: (stats: string[]) => void;
}) {
    const [hideData, setHideData] = useLocalStorage('hideData', false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleToggleStat = (statId: string) => {
        if (stats.includes(statId)) {
            setStats(stats.filter(stat => stat !== statId));
        } else {
            setStats([...stats, statId]);
        }
    }

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
                <StatList stats={stats} setStats={setStats} />
                <Divider />
            </Drawer>
            <MainContentBox drawerOpen={drawerOpen}>
                {hideData ? null : children}
            </MainContentBox>
        </Box>
    );
}