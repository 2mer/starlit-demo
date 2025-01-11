import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { ArrowLeft, ArrowRight, Sun } from "lucide-react";

function TimePhase() {
	const { sun, setSun, prevPhase } = useStore();

	return (
		<div className="flex flex-col h-full p-10 gap-10 justify-start w-[350px]">
			<div className="flex flex-col gap-2">
				<h3 className="text-md text-slate-500">Book celestial event</h3>
				<h2 className="text-3xl">Time selection</h2>
			</div>

			<div className="flex gap-2">
				<Sun />
				<Slider
					defaultValue={[50]}
					max={1}
					min={0}
					step={0.01}
					className={cn("w-[200px]")}
					value={[sun]}
					onValueChange={(v) => {
						setSun(v[0]);
					}}
				/>
				<span>{Math.round(sun * 360)}°</span>
			</div>

			<div className="flex justify-between">
				<Button onClick={prevPhase} variant="outline">
					<ArrowLeft /> Back
				</Button>
				<Button onClick={() => alert("End of demo")}>
					Next <ArrowRight />
				</Button>
			</div>
		</div>
	);
}

export default TimePhase;