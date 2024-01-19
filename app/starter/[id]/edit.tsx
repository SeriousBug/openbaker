import { useLocalSearchParams } from "expo-router";
import StarterAdd from "../add";
import { useStarter } from "../../../lib/data/starter";
import { Loading } from "../../../components/Loading";

export default function StarterEdit() {
  const id = useLocalSearchParams().id as string;
  const { starter } = useStarter({ id });

  if (!starter) return <Loading />;

  return <StarterAdd initialStarter={starter} />;
}
