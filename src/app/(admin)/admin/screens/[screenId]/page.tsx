import { Screen } from "@/types/screen";
import axios, { AxiosError } from "axios";
import { ScreenForm } from "./components/form";

const screenPage = async ({ params }: { params: { screenId: string } }) => {
  let screen: Screen | null = null;
  try {
    const { data } = await axios.get(
      `${process.env.SERVER_URL}/screens/${params.screenId}`
    );
    screen = data.data as Screen;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.status === 404) screen = null;
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ScreenForm initialData={screen} />
      </div>
    </div>
  );
};

export default screenPage;
