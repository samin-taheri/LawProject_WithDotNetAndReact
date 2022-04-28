import {Icon} from '@iconify/react';
import 'react-datepicker/dist/react-datepicker.css';
import plusFill from '@iconify/icons-eva/plus-fill';
import {format} from 'date-fns';
// material
import {
    Stack,
    Button,
    Container,
    Typography,
    TextField,
    Grid,
    InputAdornment,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Card,
    IconButton,
    Divider
} from '@mui/material';
// components
import Page from '../components/Page';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import Modal from "@mui/material/Modal";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import React, {useEffect, useState} from "react";
import PopupMessageService from "../services/popupMessage.service";
import AuthService from "../services/auth.service";
import {Global} from "../Global";
import Scrollbar from "../components/Scrollbar";
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import CircularProgress from "@mui/material/CircularProgress";
import roundUpdate from "@iconify/icons-ic/round-update";
import attachFill from '@iconify/icons-eva/attach-fill';
import CourtOfficeTypesService from "../services/courtOfficeType.service";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CourtOfficesService from "../services/courtOffices.service";
import ClientsServise from "../services/clients.servise";
import CaseTypeService from "../services/caseType.service";
import CaseStatusesService from "../services/caseStatus.service";
import CasesService from "../services/cases.service";
import RoleTypesService from "../services/roleTypes.service";
import layersOutline from "@iconify/icons-eva/layers-outline";
import {useNavigate} from "react-router-dom";
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from "../components/_dashboard/user/Iconify";
import {alpha, styled} from "@mui/material/styles";
import MenuPopover from "../components/MenuPopover";
// ----------------------------------------------------------------------
const options = [
    'upload',
    'Edit',
    'Details',
    'History',
    'Delete'
];

const ITEM_HEIGHT = 48;

const ArrowStyle = styled('span')(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        top: -7,
        zIndex: 1,
        width: 12,
        right: 20,
        height: 12,
        content: "''",
        position: 'absolute',
        borderRadius: '0 0 4px 0',
        transform: 'rotate(-135deg)',
        background: theme.palette.background.paper,
        borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`
    }
}));
export default function Cases() {

    const today = new Date();
    const date = today.setDate(today.getDate());
    const defaultValue = new Date(date).toISOString().split('T')[0]
    const popupMessageService = new PopupMessageService();
    const authService = new AuthService();
    const catchMessagee = Global.catchMessage;
    const casesService = new CasesService();
    const roleTypesService = new RoleTypesService();
    const courtOfficeTypesService = new CourtOfficeTypesService();
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openModalForDetails, setOpenModalForDetails] = useState(false);

    const [courtOfficeTypeIdForFilter, setCourtOfficeTypeIdForFilter] = useState(-1);
    const [isActiveForFilter, setIsActiveForFilter] = useState(-1);
    const [courtOffices, setCourtOffices] = useState([]);
    const [courtOfficeAdd, setCourtOfficeAdd] = useState(0);
    const [courtOfficeIdForFilter, setCourtOfficeIdForFilter] = useState(-1);
    const [clients, setClients] = useState([]);
    const [clientsAdd, setClientsAdd] = useState(0);
    const [clientIdForFilter, setClientIdForFilter] = useState(-1);
    const [caseTypes, setCaseTypes] = useState([]);
    const [caseTypeAdd, setCaseTypeAdd] = useState(0);
    const [caseTypeIdForFilter, setCaseTypeIdForFilter] = useState(-1);
    const [caseStatuses, setCaseStatuses] = useState([]);
    const [caseStatusAdd, setCaseStatusAdd] = useState(0);
    const [caseStatusIdForFilter, setCaseStatusIdForFilter] = useState(-1);
    const [caseNo, setCaseNo] = useState("");
    const [information, setInformation] = useState("");
    const [startDate, setStartDate] = useState(defaultValue);
    const [decisionDate, setDecisionDate] = useState(defaultValue);
    const [endDate, setEndDate] = useState(defaultValue);
    const [cases, setCases] = useState([]);
    const [caseId, setCaseId] = useState(0);
    const [courtOfficeTypes, setCourtOfficeTypes] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
    const [selectedCourtOfficeTypeId, setSelectedCourtOfficeTypeId] = useState(0)
    const [selectedRoleTypes, setSelectedRoleTypes] = useState(0)
    const [description, setDescription] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [time, setTime] = useState(true);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl(null);
    };

    function filtering(cases) {
        let filteredCaseTypes = cases
        if (courtOfficeTypeIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.CourtOfficeType.CourtOfficeTypeId === courtOfficeTypeIdForFilter)
        if (courtOfficeIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.CourtOffice.CourtOfficeId === courtOfficeIdForFilter)
        if (clientIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.Customer.CustomerId === clientIdForFilter)
        if (caseTypeIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.CaseType.CaseTypeId === caseTypeIdForFilter)
        if (caseStatusIdForFilter > 0)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.CaseStatus.CaseStatusId === caseStatusIdForFilter)
        if (isActiveForFilter > -1)
            filteredCaseTypes = filteredCaseTypes.filter(c => c.CaseStatus.IsActive == isActiveForFilter)
        return filteredCaseTypes
    }

    function handleTatChange(TatId) {
        getAllRoleTypes(TatId)
        setSelectedCourtOfficeTypeId(TatId)
    }

    //Changing Activity of the current Case Status
    const changeActivity = (cId, caseStatusId) => {
        casesService.changeActivity2(cId, caseStatusId).then(result => {
            getAllCases()
            setCaseStatusAdd(caseStatusId.target.value)
        }, error => {
            popupMessageService.AlertErrorMessage(error.response.data.Message)
        }).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    function getAllCourtOfficeTypes() {
        courtOfficeTypesService.getAll().then(result => {
                setCourtOfficeTypes(result.data.Data)
                setSelectedCourtOfficeTypeId(result.data.Data[0].CourtOfficeTypeId)
                getAllRoleTypes(result.data.Data[0].CourtOfficeTypeId)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    function getAllRoleTypes(selectedId) {
        roleTypesService.getAllByCourtOfficeTypeId(selectedId).then(result => {
                let id = result.data.Data[0].RoleTypeId
                setSelectedRoleTypes(id)
                setRoleTypes(result.data.Data)
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    // List all court offices
    const getAllCourtOffices = () => {
        const courtOfficesService = new CourtOfficesService();
        courtOfficesService
            .getAll()
            .then(
                (response) => {
                    setCourtOffices(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.CourtOfficeId,
                            label: item.CourtOfficeName,
                            key: item.CourtOfficeName
                        });
                    });
                    setCourtOfficeAdd(list[0].value)
                    setCourtOffices(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    // List all clients
    const getAllCustomers = () => {
        const clientsServise = new ClientsServise();
        clientsServise
            .getAll()
            .then(
                (response) => {
                    setClients(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.CustomerId,
                            label: item.CustomerName,
                            key: item.CustomerName
                        });
                    });
                    setClientsAdd(list[0].value)
                    setClients(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };
    // List all Case Types
    const getAllCaseTypes = () => {
        const caseTypeService = new CaseTypeService();
        caseTypeService
            .getAll()
            .then(
                (response) => {
                    setCaseTypes(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.CaseTypeId,
                            label: item.Description,
                            key: item.Description
                        });
                    });
                    setCaseTypeAdd(list[0].value)
                    setCaseTypes(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };
    // List all Case Statuses
    const getAllCaseStatuses = () => {
        const caseStatusesService = new CaseStatusesService();
        caseStatusesService
            .getAll()
            .then(
                (response) => {
                    setCaseStatuses(response.data.Data);
                    const CaseTypesFromApi = response.data.Data;
                    const list = [];
                    CaseTypesFromApi.forEach((item) => {
                        list.push({
                            value: item.CaseStatusId,
                            label: item.Description,
                            key: item.Description
                        });
                    });
                    setCaseStatusAdd(list[0].value)
                    setCaseStatuses(list);
                },
                (error) => {
                    popupMessageService.AlertErrorMessage(error.response.data.Message);
                }
            )
            .catch(() => {
                popupMessageService.AlertErrorMessage(catchMessagee)
            });
    };

    const handleOpen = () => {
        setCaseId(0)
        setCaseNo(0)
        setInformation('')
        setStartDate(defaultValue)
        setDecisionDate(defaultValue)
        setEndDate(defaultValue)
        setOpenModal(true)
    };
    const handleClose = () => {
        setOpenModal(false)
    };

    const getAllCases = () => {
        casesService.getAll().then(
            (result) => {
                if (result.data.Success) {
                    setCases(result.data.Data)
                    setIsLoading(false)
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    function deleteCases(id) {
        casesService.delete(id).then(result => {
                if (result.data.Success) {
                    getAllCases()
                    popupMessageService.AlertSuccessMessage(result.data.Message);
                }
            },
            (error) => {
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    };

    function modalForEdit(id) {
        casesService.getById(id).then(result => {
            if (result.data.Success) {
                let edit = result.data.Data
                setCaseId(edit.CaseeId)
                setSelectedCourtOfficeTypeId(edit.CourtOfficeType.CourtOfficeTypeId)
                setCourtOfficeAdd(edit.CourtOffice.CourtOfficeId)
                setClientsAdd(edit.Customer.CustomerId)
                setCaseTypeAdd(edit.CaseType.CaseTypeId)
                setCaseStatusAdd(edit.CaseStatus.CaseStatusId)
                setSelectedRoleTypes(edit.RoleTypeId)
                setCaseNo(edit.CaseNo)
                setInformation(edit.Info)
                setStartDate(edit.StartDate.format(defaultValue))
                setDecisionDate(edit.DecisionDate.format(defaultValue))
                setEndDate(edit.EndDate.format(defaultValue))
            }
        })
        setOpenModal(true)
    }

    function getByIdCases(id) {
        casesService.getById(id).then(result => {
            if (result.data.Success) {
                let edit = result.data.Data
                setDescription(edit.CourtOffice.Description)
                setCustomerName(edit.Customer.CustomerName)
                setCustomerPhone(edit.Customer.PhoneNumber)
                setCaseNo(edit.CaseNo)
                setInformation(edit.Info)
                setStartDate(edit.StartDate)
            }
        })
        setOpenModalForDetails(true)
    }

    const handleClosModal = () => {
        setOpenModalForDetails(false)
    }

    function addNewRecord() {
        let obj = {
            courtOfficeTypeId: selectedCourtOfficeTypeId,
            courtOfficeId: courtOfficeAdd,
            customerId: clientsAdd,
            caseTypeId: caseTypeAdd,
            caseStatusId: caseStatusAdd,
            roleTypeId: selectedRoleTypes,
            caseNo: caseNo,
            info: information,
            startDate: startDate,
            decisionDate: decisionDate,
            endDate: endDate,
        }
        let re
        if (caseId > 0) {
            obj.CaseeId = caseId
            re = casesService.update(obj)
        } else {
            re = casesService.add(obj)
        }
        re.then((result) => {
                if (result.data.Success) {
                    getAllCases()
                    setOpenModal(false)
                    popupMessageService.AlertSuccessMessage(result.data.Message)
                }
            },
            (error) => {
                setOpenModal(false)
                popupMessageService.AlertErrorMessage(error.response.data.Message);
            }
        ).catch(() => {
            popupMessageService.AlertErrorMessage(catchMessagee)
        })
    }

    useEffect(() => {
        getAllCases()
        getAllCourtOfficeTypes()
        getAllCourtOffices()
        getAllCustomers()
        getAllCaseTypes()
        getAllCaseStatuses()
        setTime(false)
    }, []);

    return (
        <Page title="Cases | MediLaw">
            {time === true ?
                <Stack sx={{color: 'grey.500', padding: 30}} spacing={2} direction="row"
                       justifyContent='center' alignSelf='center' left='50%'>
                    <CircularProgress color="inherit"/>
                </Stack>
                :
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                        <Typography variant="h4" gutterBottom>
                            Cases
                        </Typography>
                        {authService.DoesHaveMandatoryClaim('CaseeAdd') || authService.DoesHaveMandatoryClaim('LicenceOwner') ? (
                            <>
                                <Button onClick={handleOpen} variant="contained" startIcon={<Icon icon={plusFill}/>}>
                                    New Record
                                </Button>
                                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                                       hideBackdrop={true}
                                       disableEscapeKeyDown={true}
                                       open={openModal}
                                       aria-labelledby="modal-modal-title"
                                       aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 470,
                                        backgroundColor: 'background.paper',
                                        border: '2px solid #fff',
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2
                                    }}>
                                        <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                                            {caseId > 0 ?
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Edit record!
                                                </Typography>
                                                :
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Add new record!
                                                </Typography>
                                            }
                                            <IconButton sx={{bottom: 4}}>
                                                <CloseIcon onClick={handleClose}/>
                                            </IconButton>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <Stack mb={3} alignItems="center" justifyContent="space-around">
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {courtOfficeTypes.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Court Office Type"
                                                                    value={selectedCourtOfficeTypeId}
                                                                    onChange={(e) => handleTatChange(e.target.value)}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <AccountBalanceOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {courtOfficeTypes.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.CourtOfficeTypeId}
                                                                        >
                                                                            {item.CourtOfficeTypeName}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    {roleTypes.length > 0 ? (
                                                        <Stack mb={4} justifyContent="space-around">
                                                            <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                                <FormControl fullWidth size="small">
                                                                    <TextField
                                                                        select
                                                                        size='small'
                                                                        label="Role Type"
                                                                        value={selectedRoleTypes}
                                                                        onChange={(e) => setSelectedRoleTypes(e.target.value)}
                                                                        key={Math.random().toString(36).substr(2, 9)}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <ContactMailOutlinedIcon/>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                    >
                                                                        {roleTypes.map((item) => (
                                                                            <MenuItem
                                                                                key={Math.random().toString(36).substr(2, 9)}
                                                                                value={item.RoleTypeId}
                                                                            >
                                                                                {item.RoleName}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </FormControl>
                                                            </Box>
                                                        </Stack>
                                                    ) : null}
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {clients.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Clients"
                                                                    value={clientsAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setClientsAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <PersonOutlineOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {clients.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    {courtOffices.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Court Offices"
                                                                    value={courtOfficeAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setCourtOfficeAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <BalanceOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {courtOffices.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    {caseTypes.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Case Types"
                                                                    value={caseTypeAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setCaseTypeAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <BusinessCenterOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {caseTypes.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                    {caseStatuses.length > 0 ? (
                                                        <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                            <FormControl fullWidth size="small">
                                                                <TextField
                                                                    select
                                                                    size='small'
                                                                    label="Case Statuses"
                                                                    value={caseStatusAdd}
                                                                    key={Math.random().toString(36).substr(2, 9)}
                                                                    onChange={(event) => setCaseStatusAdd(event.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <NextWeekOutlinedIcon/>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                >
                                                                    {caseStatuses.map((item) => (
                                                                        <MenuItem
                                                                            key={Math.random().toString(36).substr(2, 9)}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </FormControl>
                                                        </Box>
                                                    ) : null}
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                type='number'
                                                                size="small"
                                                                label="Case No"
                                                                value={caseNo}
                                                                onChange={(event) => setCaseNo(event.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <MedicalServicesOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                    <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="Start Date"
                                                                type="date"
                                                                size="small"
                                                                value={startDate}
                                                                onChange={(e) => setStartDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <TodayOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                <Stack mb={3} direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                                    <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="Decision Date"
                                                                type="date"
                                                                size="small"
                                                                value={decisionDate}
                                                                onChange={(e) => setDecisionDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <EventAvailableOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                    <Box sx={{maxWidth: 193, minWidth: 193}}>
                                                        <FormControl fullWidth size="small">
                                                            <TextField
                                                                id="date"
                                                                label="End Date"
                                                                type="date"
                                                                size="small"
                                                                value={endDate}
                                                                onChange={(e) => setEndDate(e.target.value)}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <InsertInvitationOutlinedIcon/>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Stack>
                                                <TextField
                                                    fullWidth
                                                    type='text'
                                                    size="small"
                                                    multiline
                                                    label="Information"
                                                    value={information}
                                                    onChange={(event) => setInformation(event.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <DnsOutlinedIcon/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Stack>
                                            {caseId > 0 ?
                                                <Button sx={{bottom: 7}} size="large" type="submit" variant="contained"
                                                        onClick={() => addNewRecord()}>
                                                    Edit!
                                                </Button>
                                                :
                                                <Button sx={{bottom: 7}} size="large" type="submit" variant="contained"
                                                        onClick={() => addNewRecord()}>
                                                    Add!
                                                </Button>
                                            }
                                        </Stack>
                                    </Box>
                                </Modal>
                            </>
                        ) : null}
                    </Stack>
                    <Stack item xs={12} md={6} lg={4} mb={5} flexDirection="row" alignItems="center" justifyContent="space-around">
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Court Office Type
                            </Typography>
                            {courtOfficeTypes.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Court Office Type"
                                            value={courtOfficeTypeIdForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setCourtOfficeTypeIdForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountBalanceOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {courtOfficeTypes.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.CourtOfficeTypeId}>
                                                    {item.CourtOfficeTypeName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Court Offices
                            </Typography>
                            {courtOffices.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Court Offices"
                                            value={courtOfficeIdForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setCourtOfficeIdForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BalanceOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {courtOffices.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Clients
                            </Typography>
                            {clients.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Clients"
                                            value={clientIdForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setClientIdForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {clients.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                    </Stack>
                    <Stack  mb={5} marginTop={-7} flexDirection="row" alignItems="center" justifyContent="space-around">
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Case Types
                            </Typography>
                            {caseTypes.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Case Types"
                                            value={caseTypeIdForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setCaseTypeIdForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BusinessCenterOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {caseTypes.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Case Statuses
                            </Typography>
                            {caseStatuses.length > 0 ? (
                                <Box sx={{minWidth: 300}}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            select
                                            size='small'
                                            label="Case Statuses"
                                            value={caseStatusIdForFilter}
                                            key={Math.random().toString(36).substr(2, 9)}
                                            onChange={(e) => setCaseStatusIdForFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <NextWeekOutlinedIcon/>
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                                                All
                                            </MenuItem>
                                            {caseStatuses.map((item) => (
                                                <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                          value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            ) : null}
                        </Stack>
                        <Stack mb={5} justifyContent="space-around">
                            <Typography variant="body1" gutterBottom mb={3}>
                                Status
                            </Typography>
                            <Box sx={{minWidth: 300}}>
                                <FormControl fullWidth size="small">
                                    <TextField
                                        select
                                        size='small'
                                        value={isActiveForFilter}
                                        key={Math.random().toString(36).substr(2, 9)}
                                        label="Status"
                                        onChange={(e) => setIsActiveForFilter(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ToggleOffOutlinedIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    >
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)}
                                                  value={-1}>All</MenuItem>
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)} value={1}>
                                            Active
                                        </MenuItem>
                                        <MenuItem key={Math.random().toString(36).substr(2, 9)} value={0}>
                                            Passive
                                        </MenuItem>
                                    </TextField>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Stack>
                    <Card sx={{marginTop: -3}}>
                        <Scrollbar>
                            {isLoading === true ?
                                <Stack sx={{color: 'grey.500', padding: 10}} spacing={2} direction="row"
                                       justifyContent='center'>
                                    <CircularProgress color="inherit"/>
                                </Stack>
                                :
                                <>
                                    {cases.length > 0 ? (
                                        <TableContainer component={Paper}>
                                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{paddingLeft: 7}}>Court Office Type</TableCell>
                                                        <TableCell align="left">Court Office</TableCell>
                                                        <TableCell align="left">Client</TableCell>
                                                        <TableCell align="left">Case Type</TableCell>
                                                        <TableCell align="left">Case Status</TableCell>
                                                        <TableCell align="left">Edit</TableCell>
                                                        <TableCell align="left">Settings</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <>
                                                        {filtering(cases).map((row) => (
                                                            <TableRow
                                                                key={row.CaseeId}
                                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                            >
                                                                <TableCell component="th" scope="row"
                                                                           sx={{paddingLeft: 7}}>
                                                                    {row.CourtOfficeType.CourtOfficeTypeName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.CourtOffice.CourtOfficeName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.Customer.CustomerName}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.CaseType.Description}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {row.CaseStatus.Description}
                                                                </TableCell>
                                                                {/*
                                                            <TableCell component="th" scope="row">
                                                                {caseStatuses.length > 0 ? (
                                                                    <TextField
                                                                        select
                                                                        size='small'
                                                                        value={caseStatusAdd}
                                                                        key={Math.random().toString(36).substr(2, 9)}
                                                                        onChange={(event) => changeActivity(row.CaseeId, caseStatusAdd)}
                                                                    >
                                                                        {caseStatuses.map((item) => (
                                                                            <MenuItem
                                                                                key={Math.random().toString(36).substr(2, 9)}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                ) : null}
                                                            </TableCell>
                                                            */}
                                                                <TableCell>
                                                                    <Button
                                                                        onClick={() => modalForEdit(row.CaseeId)}
                                                                        variant="contained"
                                                                        sx={{backgroundColor: '#b1b9be'}}
                                                                        startIcon={<Icon icon={roundUpdate}/>}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        sx={{ opacity: 0.7}}
                                                                        aria-label="more"
                                                                        id="long-button"
                                                                        aria-controls={open ? 'long-menu' : undefined}
                                                                        aria-expanded={open ? 'true' : undefined}
                                                                        aria-haspopup="true"
                                                                        onClick={handleClick}
                                                                    >
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                    <MenuPopover
                                                                        id="long-menu"
                                                                        MenuListProps={{
                                                                            'aria-labelledby': 'long-button',
                                                                        }}
                                                                        anchorEl={anchorEl}
                                                                        open={open}
                                                                        onClose={handleClose2}
                                                                        sx={{
                                                                            mt: -0.5,
                                                                            padding:1,
                                                                            width: 140,
                                                                            minHeight: 160,
                                                                            '& .MuiMenuItem-root': {
                                                                                px: 1,
                                                                                typography: 'body2',
                                                                                borderRadius: 0.75,
                                                                                '& svg': { mr: 2, width: 20, height: 20 },
                                                                            },
                                                                        }}
                                                                    >
                                                                        <MenuItem onClick={() => navigate('/dashboard/cases/attachment/' + row.CaseeId)}>
                                                                            <Iconify icon={'eva:attach-fill'} />
                                                                            Upload
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => getByIdCases(row.CaseeId)}>
                                                                            <Iconify icon={'eva:layers-outline'} />
                                                                            Details
                                                                        </MenuItem>
                                                                        <MenuItem>
                                                                            <Iconify icon={'eva:map-outline'} />
                                                                            History
                                                                        </MenuItem>
                                                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                                                        {authService.DoesHaveMandatoryClaim('CaseeDelete') || authService.DoesHaveMandatoryClaim('LicenceOwner') ? (
                                                                        <>
                                                                            <MenuItem onClick={() => deleteCases(row.CaseeId)} sx={{ color: 'error.main' }}>
                                                                            <Iconify icon={'eva:trash-2-outline'}/>
                                                                            Delete
                                                                        </MenuItem>
                                                                        </>
                                                                        ) : null}
                                                                    </MenuPopover>
                                                                </TableCell>
                                                                <Modal sx={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}
                                                                       hideBackdrop={true}
                                                                       disableEscapeKeyDown={true}
                                                                       open={openModalForDetails}
                                                                       aria-labelledby="modal-modal-title"
                                                                       aria-describedby="modal-modal-description"
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            minWidth: 500,
                                                                            maxWidth: 500,
                                                                            backgroundColor: 'background.paper',
                                                                            border: '2px solid #fff',
                                                                            boxShadow: 24,
                                                                            p: 4,
                                                                            borderRadius: 2
                                                                        }}>
                                                                        <Stack mb={4} flexDirection="row"
                                                                               justifyContent='space-between'>
                                                                            <Typography id="modal-modal-title"
                                                                                        variant="h6" component="h2">
                                                                                Details!
                                                                            </Typography>
                                                                            <IconButton sx={{bottom: 4}}>
                                                                                <CloseIcon onClick={handleClosModal}/>
                                                                            </IconButton>
                                                                        </Stack>
                                                                        <Stack mb={2} justifyContent="space-around">
                                                                            <Box sx={{minWidth: 300}}>
                                                                                <TableContainer component={Paper}>
                                                                                    <Table aria-label="simple table">
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell
                                                                                                variant="head">Description</TableCell>
                                                                                            <TableCell>{description}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Customer
                                                                                                Name</TableCell>
                                                                                            <TableCell>{customerName}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Customer
                                                                                                Phone Number</TableCell>
                                                                                            <TableCell>{customerPhone}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Case
                                                                                                No</TableCell>
                                                                                            <TableCell>{caseNo}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Start
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(startDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">Decision
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(decisionDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell variant="head">End
                                                                                                Date</TableCell>
                                                                                            <TableCell>{format(new Date(endDate), 'dd/MM/yyyy')}</TableCell>
                                                                                        </TableRow>
                                                                                        <TableRow sx={{
                                                                                            backgroundColor: '#f7f7f7',
                                                                                            padding: 15,
                                                                                            border: '6px solid #fff'
                                                                                        }}>
                                                                                            <TableCell
                                                                                                variant="head">Info</TableCell>
                                                                                            <TableCell>{information}</TableCell>
                                                                                        </TableRow>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Box>
                                                                        </Stack>
                                                                    </Box>
                                                                </Modal>
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <TableCell sx={{width: '40%'}}>
                                            <img src="/static/illustrations/no.png" alt="login"/>
                                            <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No
                                                Data Found</Typography>
                                        </TableCell>
                                    )}
                                </>
                            }
                        </Scrollbar>
                    </Card>
                </Container>
            }
        </Page>
    );
}