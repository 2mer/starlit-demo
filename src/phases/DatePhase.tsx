import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";

function DatePhase() {
	const { date, setDate, nextPhase, prevPhase } = useStore();

	return (
		<div className="flex flex-col h-full p-10 gap-10 justify-start w-[350px]">
			<div className="flex flex-col gap-2">
				<h3 className="text-md text-slate-500">Book celestial event</h3>
				<h2 className="text-3xl">Date selection</h2>
			</div>

			<div className="flex flex-col gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[280px] justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "PPP") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={(v) => setDate(v!)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex justify-between">
				<Button onClick={prevPhase} variant="outline">
					<ArrowLeft /> Back
				</Button>
				<Button disabled={!date} onClick={nextPhase}>
					Next <ArrowRight />
				</Button>
			</div>
		</div>
	);
}

export default DatePhase;