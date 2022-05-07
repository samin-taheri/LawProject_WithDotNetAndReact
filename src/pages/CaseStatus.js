import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import roundUpdate from '@iconify/icons-ic/round-update';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@mui/material/CircularProgress';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Box,
  Paper,
  TableHead,
  TextField, InputAdornment, IconButton
} from '@mui/material';
// components
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import AuthService from '../services/auth.service';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import CourtOfficeTypesService from '../services/courtOfficeType.service';
import PopupMessageService from '../services/popupMessage.service';
import CaseStatusesService from '../services/caseStatus.service';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import {Global} from "../Global";
import ToastService from "../services/toast.service";
// ----------------------------------------------------------------------


export default function User() {
  const [courtOfficeTypes, setCourtOfficeTypes] = useState([]);
  const [caseStatuses, setCaseStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [statusForAdd, setStatusForAdd] = useState(true);
  const [courtOfficeTypeAdd, setCourtOfficeTypeAdd] = useState("");
  const [openModal, setOpen] = useState(false);
  const [profileName, setProfileName] = useState("");

  const [caseStatusUpdateId, setCaseStatusUpdateId] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [courtOfficeTypeIdForFilter, setCourtOfficeTypeIdForFilter] = useState(-1);
  const [isActiveForFilter, setIsActiveForFilter] = useState(-1);

  const caseStatusesService = new CaseStatusesService();
  const popupMessageService = new PopupMessageService();
  const toastService = new ToastService();
  const authService = new AuthService();

  const catchMessagee = Global.catchMessage;

  //Changing Activity of the current Case Status
  const changeActivity = (cId) => {
    caseStatusesService.changeActivity2(cId).then(result => {
      getAllCaseStatuses()
      toastService.AlertSuccessMessage(result.data.Message);
    }, error => {
      toastService.AlertErrorMessage(error.response.data.Message)
    }).catch(()=> {
      toastService.AlertErrorMessage(catchMessagee)
    })
  };

  function filtering(caseStatuses) {
    let filteredCaseStatuses = caseStatuses
    if (courtOfficeTypeIdForFilter > 0)
      filteredCaseStatuses = filteredCaseStatuses.filter(c => c.CourtOfficeTypeGetDto.CourtOfficeTypeId === courtOfficeTypeIdForFilter)
    if (isActiveForFilter > -1)
      filteredCaseStatuses = filteredCaseStatuses.filter(c => c.IsActive == isActiveForFilter)
    return filteredCaseStatuses
  }
  //List all the Case Statuses of current licence
  const getAllCaseStatuses = () => {
    if (authService.DoesHaveMandatoryClaim('CaseStatusGetAll')) {
      caseStatusesService.getAll().then(
        (result) => {
          if (result.data.Success) {
            setCaseStatuses(result.data.Data);
            setIsLoading(false)
          }
        },
        (error) => {
          popupMessageService.AlertErrorMessage(error.response.data.Message);
        }
      ).catch(()=> {
        popupMessageService.AlertErrorMessage(catchMessagee)
      })
    }
  };
  // List all court office types
  const getAllCourtOfficeTypes = () => {
    const courtOfficeTypesService = new CourtOfficeTypesService();
    courtOfficeTypesService
      .getAll()
      .then(
        (response) => {
          setCourtOfficeTypes(response.data.Data);
          const CourtOfficeFromApi = response.data.Data;
          const list = [];
          CourtOfficeFromApi.forEach((item) => {
            list.push({
              value: item.CourtOfficeTypeId,
              label: item.CourtOfficeTypeName,
              key: item.CourtOfficeTypeName
            });
          });
          setCourtOfficeTypeAdd(list[0].value)
          setCourtOfficeTypes(list);
        },
        (error) => {
          popupMessageService.AlertErrorMessage(error.response.data.Message);
        }
      )
      .catch((errors) => {
        popupMessageService.AlertErrorMessage(catchMessagee)
      });
  };

  const createRandomKey = () => {
    return Math.random().toString(36).substr(2, 9);
  }

  const handleOpen = () => {
    setProfileName("")
    setStatusForAdd(true)
    setCourtOfficeTypeAdd(courtOfficeTypes[0].value)
    setCaseStatusUpdateId(0)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllCourtOfficeTypes();
    getAllCaseStatuses();
  }, []);

  const handleChangeCourtOffice = (event) => {
    setCourtOfficeTypeAdd(event.target.value);
  };
  const handleChangeStatus = (event) => {
    setStatusForAdd(event.target.value);
  };

  const addNewRecord = () => {
    let obj = {
      courtOfficeTypeId: courtOfficeTypeAdd,
      description: profileName,
      isActive: statusForAdd
    }
    let re
    if (caseStatusUpdateId > 0) {
      obj.caseStatusId = caseStatusUpdateId
      re = caseStatusesService.update(obj)
    }
    else {
      re = caseStatusesService.add(obj)
    }
    re.then(
      (result) => {
        if (result.data.Success) {
          getAllCaseStatuses()
          setOpen(false)
          popupMessageService.AlertSuccessMessage(result.data.Message)
        }
      },
      (error) => {
          setOpen(false)
          setErrorMessage(error.response.data.Message);
      }
    ).catch(()=> {
      popupMessageService.AlertErrorMessage(catchMessagee)
    })
  };

  function openModelForUpdate(id) {
    caseStatusesService.getById(id).then(result => {
      if (result.data.Success) {
        let caseStatusUpdate = result.data.Data
        setCaseStatusUpdateId(caseStatusUpdate.CaseStatusId)
        setCourtOfficeTypeAdd(caseStatusUpdate.CourtOfficeTypeGetDto.CourtOfficeTypeId)
        setProfileName(caseStatusUpdate.Description)
        setStatusForAdd(caseStatusUpdate.IsActive)
      }
    },
        (error) => {
          setErrorMessage(error.response.data.Message);
        }
    ).catch(()=> {
      popupMessageService.AlertErrorMessage(catchMessagee)
    })
    setOpen(true)
  }
  return (
    <Page title="Case Status | MediLaw">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            Case Status
          </Typography>
          {authService.DoesHaveMandatoryClaim('CaseStatusAdd') || authService.DoesHaveMandatoryClaim('LicenceOwner')  ? (
            <>
              <Button onClick={handleOpen} variant="contained" startIcon={<Icon icon={plusFill} />}>
                New Record
              </Button>
              <Modal sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                hideBackdrop={true}
                disableEscapeKeyDown={true}
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 470,
                    backgroundColor: 'background.paper',
                    border: '2px solid #fff',
                    p: 4,
                    borderRadius: 2
                  }}
                >
                  <Stack mb={5} flexDirection="row" justifyContent='space-between'>
                    {caseStatusUpdateId > 0 ?
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Edit record!
                        </Typography>
                        :
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Add new record!
                        </Typography>
                    }
                    <IconButton sx={{bottom:3}}>
                    <CloseIcon onClick={handleClose}/>
                    </IconButton>
                  </Stack>
                  <Stack spacing={2} >
                    <Stack mb={2} alignItems="center" justifyContent="space-around">
                      <Stack mb={3} justifyContent="space-around">
                        <Box sx={{ minWidth: 400 }}>
                          <TextField
                            autoFocus
                            fullWidth
                            size="small"
                            label="Case Status Name"
                            value={profileName}
                            onChange={(event) => setProfileName(event.target.value)}
                            InputProps={{
                              startAdornment: (
                                  <InputAdornment position="start">
                                    <DriveFileRenameOutlineOutlinedIcon />
                                  </InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Stack>
                      <Stack mb={3} justifyContent="space-around">
                        {courtOfficeTypes.length > 0 ? (
                          <Box sx={{ minWidth: 400 }}>
                            <FormControl fullWidth size="small">
                              <TextField
                                select
                                size='small'
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={courtOfficeTypeAdd}
                                key={Math.random().toString(36).substr(2, 9)}
                                label="Court Office Type"
                                onChange={handleChangeCourtOffice}
                                  InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                          <AccountBalanceOutlinedIcon />
                                        </InputAdornment>
                                    )
                                  }}
                              >
                                {courtOfficeTypes.map((item) => (
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
                      <Stack justifyContent="space-around">
                        <Box sx={{ minWidth: 400 }}>
                          <FormControl fullWidth size="small">
                            <TextField
                              select
                              size='small'
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={statusForAdd}
                              key={createRandomKey}
                              label="Status"
                              onChange={handleChangeStatus}
                                InputProps={{
                                  startAdornment: (
                                      <InputAdornment position="start">
                                        <ToggleOffOutlinedIcon />
                                      </InputAdornment>
                                  )
                                }}
                            >
                              <MenuItem key={createRandomKey} value>
                                Active
                              </MenuItem>
                              <MenuItem key={createRandomKey} value={false}>
                                Passive
                              </MenuItem>
                            </TextField>
                          </FormControl>
                        </Box>
                      </Stack>
                    </Stack>
                    {caseStatusUpdateId > 0 ?
                        <Button sx={{top: 5}} size="large" type="submit" variant="contained" onClick={() => addNewRecord()}>Edit!</Button>
                        :
                        <Button sx={{top: 5}} size="large" type="submit" variant="contained" onClick={() => addNewRecord()}>Add!</Button>
                    }
                    <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
                  </Stack>
                </Box>
              </Modal>
            </>
          ) : null}
        </Stack>
        <Stack mb={5} flexDirection="row" alignItems="center" justifyContent="space-around">
          <Stack mb={5} justifyContent="space-around">
            <Typography variant="body1" gutterBottom mb={3}>
              Court Office Type
            </Typography>
            {courtOfficeTypes.length > 0 ? (
              <Box sx={{ minWidth: 400 }}>
                <FormControl fullWidth size="small">
                  <TextField
                    select
                    size='small'
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={courtOfficeTypeIdForFilter}
                    key={Math.random().toString(36).substr(2, 9)}
                    label="Court Office Type"
                    onChange={(e) => setCourtOfficeTypeIdForFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <AccountBalanceOutlinedIcon />
                            </InputAdornment>
                        )
                      }}
                  >
                    <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>
                      All
                    </MenuItem>
                    {courtOfficeTypes.map((item) => (
                      <MenuItem key={Math.random().toString(36).substr(2, 9)} value={item.value}>
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
            <Box sx={{ minWidth: 400 }}>
              <FormControl fullWidth size="small">
                <TextField
                  select
                  size='small'
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={isActiveForFilter}
                  key={Math.random().toString(36).substr(2, 9)}
                  label="Status"
                  onChange={(e) => setIsActiveForFilter(e.target.value)}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <ToggleOffOutlinedIcon />
                          </InputAdornment>
                      )
                    }}
                >
                  <MenuItem key={Math.random().toString(36).substr(2, 9)} value={-1}>All</MenuItem>
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
        <Card sx={{ marginTop: -3 }}>
          <Scrollbar>
            {isLoading === true ?
                <Stack sx={{ color: 'grey.500', padding: 10 }} spacing={2} direction="row" justifyContent='center'>
                  <CircularProgress color="inherit" />
                </Stack>
                :
                <>
            {caseStatuses.length > 0 ? (
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{backgroundColor: '#f7f7f7'}}>
                      <TableCell sx={{ paddingLeft: 7 }}>Case Status Name</TableCell>
                      <TableCell align="left">Court Office Name</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Change Activity</TableCell>
                      <TableCell align="left">Edit</TableCell>
                      <TableCell align="right"/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {
                        filtering(caseStatuses)
                          .map((row) => (
                            <TableRow
                              key={row.CaseStatusId}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row" sx={{ paddingLeft: 7 }}>
                                {row.Description}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {row.CourtOfficeTypeGetDto.CourtOfficeTypeName}
                              </TableCell>
                              {row.IsActive ? (
                                <TableCell component="th" scope="row">
                                  <Label variant="ghost" color="success">
                                    {sentenceCase('Active')}
                                  </Label>
                                </TableCell>
                              ) : (
                                <TableCell component="th" scope="row">
                                  <Label variant="ghost" color="error">
                                    {sentenceCase('Pasive')}
                                  </Label>
                                </TableCell>
                              )}
                              <TableCell>
                                <Switch
                                  sx={{ left: 25 }}
                                  checked={row.IsActive}
                                  onChange={() => changeActivity(row.CaseStatusId)}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  onClick={() => openModelForUpdate(row.CaseStatusId)}
                                  sx={{backgroundColor: '#b1b9be'}}
                                  startIcon={<Icon icon={roundUpdate} />}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                              <TableCell align="right"/>
                            </TableRow>
                          ))}
                    </>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
                <TableCell sx={{ width: '40%' }}>
                  <img src="/static/illustrations/no.png" alt="login" />
                  <Typography variant="h3" gutterBottom textAlign='center' color='#a9a9a9'>No Data Found</Typography>
                </TableCell>
            )}
                </>
            }
          </Scrollbar>
        </Card>
      </Container>
    </Page >
  );
}
