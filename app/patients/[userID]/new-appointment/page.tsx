import { Button } from "@/components/ui/button"
import Image from "next/image"
import PatientForm from "@/components/forms/PatientForm"
import Link from "next/link"
import AppointmentForm from "@/components/forms/AppointmentForm"
import { getPatient } from "@/lib/actions/patient.actions"

interface SearchParamProps {
  params: Promise<{ userID: string }>
}

const Appointment = async ({ params }: SearchParamProps) => {
  const { userID } = await params
  const patient = await getPatient(userID)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient?.$id}
            userID={userID}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;