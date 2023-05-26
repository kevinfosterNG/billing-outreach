//import ErrorPage from 'next/error'
export const dynamic = 'force-dynamic'
import { getRecordById, updateRecordById} from "@/utils/DatabaseWrapper";
import { redirect } from 'next/navigation';
import ChallengeFailed from '@/components/challenge-failed';

async function getPaymentDetails(id) {
    const message = await getRecordById("Messages", id ) || null;
    return message;
}

export default async function PaymentPage({params,searchParams}) {
    console.log("../submit/payment/[id]/ page hit");
    const message = await getPaymentDetails( params.id );
    console.log("Message = ", message);
    console.log("C? ", searchParams)
    // const CHALLENGES = message.challege_incorrect_answer_count ;
    
    if (message == undefined || message == null || message == "")
        return <ChallengeFailed />

    if (searchParams == {} || searchParams == null || searchParams.challenge == undefined || searchParams.challenge == "") {
        //console.log("Empty Challenge");
        //const GUESSES_LEFT = message.challege_incorrect_answer_count ? process.env.NEXTAUTH_CHALLENGE_LIMIT - message.challege_incorrect_answer_count : process.env.NEXTAUTH_CHALLENGE_LIMIT;
        const GUESSES_LEFT = process.env.NEXTAUTH_CHALLENGE_LIMIT 
            - (message.challege_incorrect_answer_count ? message.challege_incorrect_answer_count : 0);
        
        if (GUESSES_LEFT <= 0)
            return <ChallengeFailed />;
        
        return (<ChallengeForm attemptsRemaining={GUESSES_LEFT}/>);
    }
    else if (searchParams.challenge == message.dob ) {
        console.log("valid! redirect or prompt");
        const PREPOPULATED_INSTAMED_URL = "https://pay.instamed.com/Form/PaymentPortal/Default?id=nextcareuc&QuickPayCode="+ message.acct_nbr+"&email="+message.email+"&patientFirstName="+message.first_name+"&PatientLastName="+message.last_name;
        redirect(PREPOPULATED_INSTAMED_URL);
    }
    else {
        console.error("Validate failed");
        updateRecordById("Messages", message.id);

        if (message.challege_incorrect_answer_count==null)
            message.challege_incorrect_answer_count=process.env.NEXTAUTH_CHALLENGE_LIMIT;
        message.challege_incorrect_answer_count--;

        const GUESSES_LEFT = process.env.NEXTAUTH_CHALLENGE_LIMIT - message.challege_incorrect_answer_count;
        if (GUESSES_LEFT <= 0)
            return <ChallengeFailed />
        
        return (<ChallengeForm errorMessage={'Invalid answer.'} attemptsRemaining={GUESSES_LEFT} />);
    }
}

export function ChallengeForm(props) {
    console.log("Props: ", props)
    let max_dob = new Date().toISOString().slice(0, 10);

    return (
        <div>
            <h1>~~Challenge Time~~</h1>
            <p>Help us confirm your identity.</p>

            { props.errorMessage && <p className="text-align-center">{props.errorMessage}</p> }
            
            <form>
                <label>Enter the account holder's date of birth:</label>
                <input name="challenge"  type="date" max={max_dob} />
                <br/>
                <button type="submit">Submit</button>
            </form>

            <hr/>
            <small>{`Attempts remaining:  ${props.attemptsRemaining.toString()} `}</small>
        </div>
    );
}