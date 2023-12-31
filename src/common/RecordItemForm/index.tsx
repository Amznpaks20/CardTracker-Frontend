import { Box, Container, Paper, Typography, Button } from "@mui/material"
import { Control, SubmitHandler, UseFormHandleSubmit } from "react-hook-form"
import { NavigateFunction } from "react-router-dom"
import { IRecordItem } from "@/model/CardModel"
import { NewRecordItemTextField, NewRecordItemDateField, NewRecordItemSelect } from "../NewRecordItemFormItems"
import { CardCategory } from "@/enums/ECard"


type Props = {
    cardType?: String,
    choices: Array<keyof typeof CardCategory>
    control: Control<IRecordItem>,
    handleSubmit: UseFormHandleSubmit<IRecordItem>,
    navigate: NavigateFunction,
    onCancelEdit?: () => void,
    onSubmit: SubmitHandler<IRecordItem>,
}

const RecordItemForm = ({ cardType, choices, control, handleSubmit, navigate, onCancelEdit, onSubmit }: Props) => {
    return (
        <Box
            alignItems={'center'}
            display={'flex'}
            flexDirection={'column'}
            height={'100vh'}
            width={'100vw'}
        >
            <Container maxWidth="sm" sx={{ margin: '1rem' }} >
                <Paper variant="outlined" sx={{ padding: "1rem", borderRadius: '1rem', textAlign: 'center' }} >
                    <Typography variant="h5">New Transaction</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <NewRecordItemTextField control={control} name="name" label="Transaction Name" />
                        <NewRecordItemTextField control={control} name="amount" label="Amount" />
                        <NewRecordItemDateField control={control} name="date" label="Date" />
                        <NewRecordItemSelect cardType={cardType} control={control} name="category" label="Category" choices={choices} />
                        <Button type="submit">Submit</Button>
                        <Button color="error" onClick={() => {
                            onCancelEdit ? onCancelEdit() :
                                navigate(-1)
                        }}>Cancel</Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    )
}

export default RecordItemForm