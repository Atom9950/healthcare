'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';


export default function SuccessContent() {
  const { userID } = useParams(); 

  const [appointmentId, setAppointmentId] = useState<string>('');
  const [appointment, setAppointment] = useState<{
    primaryPhysician: string;
    schedule?: string;
  } | null>(null);
  const [doctor, setDoctor] = useState<any>(null);

  // Access `window.location.search` in a `useEffect`
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('appointmentId') || '';
    setAppointmentId(id);
  }, []);

  useEffect(() => {
    async function fetchAppointment() {
      if (appointmentId.trim() !== '') {
        try {
          const fetchedAppointment = await getAppointment(appointmentId.trim());
          setAppointment(fetchedAppointment);
          if (fetchedAppointment?.primaryPhysician) {
            const foundDoctor = Doctors.find(
              (doc) => doc.name === fetchedAppointment.primaryPhysician
            );
            setDoctor(foundDoctor);
          }
        } catch (error) {
          console.error('Error fetching appointment:', error);
        }
      }
    }

    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  if (!userID) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error: User ID is missing or invalid.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details:</p>
          {doctor && (
            <div className="flex items-center gap-3">
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>
              {appointment?.schedule
                ? formatDateTime(appointment.schedule).dateTime
                : 'Schedule not available'}
            </p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userID}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
      </div>
    </div>
  );
}
