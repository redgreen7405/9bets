// components/AdminPanel.jsx
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { toast, Toaster } from "react-hot-toast";
import { RoomCard } from "../components/AdminUI/RoomCard";
import { TIMER_DURATIONS } from "./../constants/timerConfig";
import Custom404 from "../components/UI/Custom404";
import Navbar from "../components/UI/Navbar";
import MobileNavbar from "../components/UI/MobileNavbar";
import BottomMenu from "../components/UI/BottomMenu";
import Footer from "../components/UI/Footer";
import "../app/globals.css";
import Loader from "../components/UI/Loader";

export const AdminPanel = () => {
  const [user] = useAuthState(auth);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(false);

  const rooms = [
    { id: 0, duration: TIMER_DURATIONS.ONE_MIN },
    { id: 1, duration: TIMER_DURATIONS.THREE_MIN },
    { id: 2, duration: TIMER_DURATIONS.FIVE_MIN },
    { id: 3, duration: TIMER_DURATIONS.TEN_MIN },
  ];

  const handleValueChange = (roomId, type, value) => {
    setSelections((prev) => ({
      ...prev,
      [roomId]: { ...prev[roomId], [type]: value },
    }));
  };

  const handleAddDraw = async (roomId) => {
    const roomSelections = selections[roomId] || {};
    const loadingToast = toast.loading("Processing...");

    if (
      !roomSelections.number ||
      !roomSelections.color ||
      !roomSelections.size
    ) {
      toast.dismiss(loadingToast);
      toast.error("Please select all options before submitting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/add-draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, selections: roomSelections }),
      });

      if (res.ok) {
        toast.success(`Selections added successfully for Room ${roomId + 1}`);
        setSelections((prev) => ({ ...prev, [roomId]: {} }));
      } else {
        toast.error("Failed to add selections. Please try again");
      }
    } catch (error) {
      console.error("Error adding draw:", error);
      toast.error("An error occurred. Please try again");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  if (!user?.providerData[0].email) return <Loader />;
  if (user?.providerData[0].email !== "adminpanel7676@gmail.com")
    return <Custom404 />;

  return (
    <>
      <Toaster position="top-center" />
      <div className="hidden md:block mb-12">
        <Navbar />
      </div>
      <div className="block md:hidden mb-12">
        <MobileNavbar />
      </div>

      <main className="px-4 py-8 mb-12 lg:mb-0">
        <div className="mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 lg:mb-8 mt-5">
            Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map(({ id, duration }) => (
              <RoomCard
                key={id}
                roomNumber={id + 1}
                duration={duration}
                onSubmit={() => handleAddDraw(id)}
                loading={loading}
                selectedValues={selections[id] || {}}
                onValueChange={(type, value) =>
                  handleValueChange(id, type, value)
                }
              />
            ))}
          </div>
        </div>
      </main>

      <div className="hidden md:block mt-0">
        <Footer />
      </div>
      <div className="block md:hidden fixed bottom-0 w-full z-20 mt-12">
        <BottomMenu />
      </div>
    </>
  );
};

export default AdminPanel;
