import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

function LocationPhase() {
	const { location, setLocation, nextPhase, prevPhase } = useStore();

	return (
		<div className="flex flex-col h-full p-10 gap-10 justify-start w-[350px]">
			<div className="flex flex-col gap-2">
				<h3 className="text-md text-slate-500">Book celestial event</h3>
				<h2 className="text-3xl">Coordinate selection</h2>
			</div>

			<div className="flex flex-col gap-2">
				Pick pod deployment coordinates by clicking on the model of the earth

				{Boolean(location) && (
					<Button onClick={() => setLocation(undefined)} variant="ghost">
						<X /> Clear selection
					</Button>
				)}
			</div>

			<div className="flex justify-between">
				<Button onClick={prevPhase} variant="outline">
					<ArrowLeft /> Back
				</Button>
				<Button disabled={!location} onClick={nextPhase}>
					Next <ArrowRight />
				</Button>
			</div>
		</div>
	);
}

export default LocationPhase;