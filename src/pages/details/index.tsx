import 'chart.js/auto';
import EditRecordItemForm from '@/pages/newFile/editRecordItemForm';
import ListsDetails from '@/pages/details/listsDetails';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box, Container, Typography, useTheme } from '@mui/material';
import { IRecord, IRecordItem } from '@/model/CardModel';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { IProfile } from '@/model/UserModel/IProfile';
import { getRecordHook, getUserIdHook } from '@/customHooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChartsDetails from './chartsDetails';
import { useDetailsPage } from './details.hooks';


type Props = {}

const CardDetails = (props: Props) => {
    const { recordId } = useParams();

    const user: IProfile | undefined = getUserIdHook();
    const cardDetails: IRecord | undefined = getRecordHook(user?.result._id, recordId);

    const theme = useTheme();

    const [toDelete, setToDelete] = useState<boolean>(false);
    const [toEdit, setToEdit] = useState<boolean>(false);
    const [editedItemId, setEditedItemId] = useState<string>("");
    const [updateDetails, setUpdateDetails] = useState<IRecord | undefined>();

    const [amountEarnLoss, setAmountEarnLoss] = useState<number>(0);
    const [inputDate, setInputDate] = useState<Date>(new Date());
    const [inputDateRecordList, setInputDateRecordList] = useState<IRecordItem[] | never[]>([]);
    const storedDate = localStorage.getItem("lastKnownInputDate");

    useDetailsPage(cardDetails, inputDate, updateDetails, user, setAmountEarnLoss, setInputDate, setInputDateRecordList, setUpdateDetails, storedDate, toDelete)

    return (
        <>
            {
                toEdit ?
                    <EditRecordItemForm
                        id={editedItemId}
                        recordId={recordId!}
                        recordItem={updateDetails}
                        setToEdit={setToEdit}
                    />
                    :
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        width={'100%'}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark'
                                ? "#202124"
                                : theme.palette.background.paper,
                            color: theme.palette.primary.dark
                        }}
                    >
                        <Typography color="primary.textContrast" variant='h5'>
                            {updateDetails ? updateDetails.name : "Card Name"}
                        </Typography>
                        <Container >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    autoFocus
                                    label={'Month & Year'}
                                    openTo='month'
                                    views={['year', 'month']}
                                    defaultValue={storedDate ? dayjs(`${new Date(storedDate)}`) : dayjs(`${new Date()}`)}
                                    onAccept={(v: any) => {
                                        setInputDate(v.$d)
                                    }}
                                    onChange={(v: any) => {
                                        setInputDate(v.$d)
                                    }}
                                />
                            </LocalizationProvider>
                        </Container>

                        <Typography variant='h6'>You {amountEarnLoss >= 0 ? `saved $${amountEarnLoss.toFixed(2)}` : `owed $${amountEarnLoss.toFixed(2)}`} this month.</Typography>
                        {
                            inputDate &&
                            <>
                                {(inputDateRecordList.length > 0 && updateDetails) ?
                                    <ChartsDetails
                                        inputDate={inputDate}
                                        inputDateRecordList={inputDateRecordList}
                                        record={updateDetails}
                                        theme={theme}
                                    /> :
                                    <Typography variant='h5'>No Transaction is being recorded for this month.</Typography>
                                }

                                {updateDetails &&
                                    <ListsDetails
                                        amountEarnLoss={amountEarnLoss}
                                        inputDateRecordList={inputDateRecordList}
                                        record={updateDetails}
                                        setEditedItemId={setEditedItemId}
                                        setToDelete={setToDelete}
                                        setToEdit={setToEdit}
                                        setUpdateDetails={setUpdateDetails} />
                                }
                            </>
                        }
                    </Box>
            }
        </>
    )
}

export default CardDetails