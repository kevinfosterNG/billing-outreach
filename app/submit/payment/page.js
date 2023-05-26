import { redirect } from 'next/navigation';

export default async function SubmitPayment(params,searchParams) {
    redirect('https://pay.instamed.com/Form/PaymentPortal/Default?id=NEXTCAREUC');
}