import ListComponent from "../comp-list";

export default function TabListWedding() {
  const tabs = [
    { id: "main-info", label: "Main Info", icon: "bx bx-info-circle" },
    { id: "scheduler", label: "Schedule", icon: "bx bx-calendar-star" },
    { id: "gallery", label: "Gallery", icon: "bx bx-photo-album" },
    { id: "history", label: "History", icon: "bx bx-book-heart" },
    { id: "gift", label: "Gift", icon: "bx bx-gift" },
    { id: "rsvp", label: "RSVP", icon: "bx bx-envelope" },
    { id: "faq", label: "FAQ", icon: "bx bx-help-circle" },
  ];

  return <ListComponent tabs={tabs} />;
}
