import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYLOADS } from "@/data";
import { useStore } from "@/store";
import { ArrowRight } from "lucide-react";

function PodPhase() {
	const { pod, setPod, nextPhase } = useStore();

	return (
		<div className="flex flex-col h-full p-10 gap-10 justify-start w-[350px]">
			<div className="flex flex-col gap-2">
				<h3 className="text-md text-slate-500">Book celestial event</h3>
				<h2 className="text-3xl">Pod selection</h2>
			</div>

			<div>
				<Select value={pod} onValueChange={setPod}>
					<SelectTrigger>
						<SelectValue placeholder="Select a pod" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(PAYLOADS).map(([k, payload]) => (
							<SelectItem value={k} key={k}>
								<div className="flex items-center gap-4">
									{/* <payload.icon color={payload.color} /> <span>{payload.name}</span> */}
									<payload.icon color={payload.color} /> <span>{payload.name}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex justify-end">
				<Button disabled={!pod} onClick={nextPhase}>
					Next <ArrowRight />
				</Button>
			</div>
		</div>
	);
}

export default PodPhase;