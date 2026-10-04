import { DeliveryPodView } from "@/components/sales/delivery-pod-view";

export const metadata = {
  title: "Delivery & POD Tracking | Mahaurja Operations",
  description: "Customer delivery status, proof of delivery upload, and client acknowledgement.",
};

export default function DeliveryPage() {
  return <DeliveryPodView />;
}
