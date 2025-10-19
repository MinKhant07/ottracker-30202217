import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Heart, Clock, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OTRecord {
  date: string;
  hours: string;
}

const OTTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedOT, setSelectedOT] = useState<string>("");
  const [records, setRecords] = useState<OTRecord[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingHours, setEditingHours] = useState<string>("");

  // Load records from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem("otRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to localStorage
  const saveRecords = (newRecords: OTRecord[]) => {
    localStorage.setItem("otRecords", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const handleSave = () => {
    if (!selectedDate || !selectedOT) {
      toast({
        title: "ရက်စွဲနှင့် OT ရွေးချယ်ပါ",
        description: "ကျေးဇူးပြု၍ ရက်စွဲနှင့် OT အချိန်ကို ရွေးချယ်ပါ",
        variant: "destructive",
      });
      return;
    }

    const dateString = format(selectedDate, "yyyy-MM-dd");
    const existingIndex = records.findIndex((r) => r.date === dateString);

    let newRecords;
    if (existingIndex >= 0) {
      newRecords = [...records];
      newRecords[existingIndex] = { date: dateString, hours: selectedOT };
    } else {
      newRecords = [...records, { date: dateString, hours: selectedOT }];
    }

    saveRecords(newRecords.sort((a, b) => b.date.localeCompare(a.date)));
    setSelectedOT("");
    
    toast({
      title: "သိမ်းဆည်းပြီးပါပြီ",
      description: `${format(selectedDate, "dd/MM/yyyy")} - OT ${selectedOT}`,
    });
  };

  const handleDelete = (date: string) => {
    const newRecords = records.filter((r) => r.date !== date);
    saveRecords(newRecords);
    toast({
      title: "ဖျက်ပြီးပါပြီ",
      description: "OT မှတ်တမ်းကို ဖျက်လိုက်ပါပြီ",
    });
  };

  const startEdit = (record: OTRecord) => {
    setEditingDate(record.date);
    setEditingHours(record.hours);
  };

  const saveEdit = () => {
    if (!editingDate) return;

    const newRecords = records.map((r) =>
      r.date === editingDate ? { ...r, hours: editingHours } : r
    );
    saveRecords(newRecords);
    setEditingDate(null);
    setEditingHours("");
    
    toast({
      title: "ပြင်ဆင်ပြီးပါပြီ",
      description: "OT မှတ်တမ်းကို ပြင်ဆင်ပြီးပါပြီ",
    });
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditingHours("");
  };

  const getOTLabel = (hours: string) => {
    switch (hours) {
      case "0":
        return "မဆင်းရဘူး";
      case "2":
        return "၂ နာရီ";
      case "4":
        return "၄ နာရီ";
      default:
        return hours;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OT Tracker
            </h1>
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">သင့်အတွက် အချစ်နဲ့ ပြုလုပ်ထားပါတယ် 💝</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left side - Calendar and OT Selection */}
          <Card className="shadow-[var(--shadow-pink)] border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                OT မှတ်တမ်းထည့်ရန်
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-primary/20 pointer-events-auto"
                />
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      ရက်စွဲ: {format(selectedDate, "dd/MM/yyyy")}
                    </label>
                    <Select value={selectedOT} onValueChange={setSelectedOT}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="OT အချိန်ရွေးပါ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">မဆင်းရဘူး</SelectItem>
                        <SelectItem value="2">၂ နာရီ (ညနေ ၆ နာရီအထိ)</SelectItem>
                        <SelectItem value="4">၄ နာရီ (ည ၈ နာရီအထိ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="lg"
                  >
                    သိမ်းမယ် 💾
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right side - OT Records */}
          <Card className="shadow-[var(--shadow-pink)] border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                OT မှတ်တမ်းများ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>မှတ်တမ်းမရှိသေးပါ</p>
                  <p className="text-sm mt-2">OT မှတ်တမ်းထည့်ပါ</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {records.map((record) => (
                      <div
                        key={record.date}
                        className="bg-secondary/50 rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-colors"
                      >
                        {editingDate === record.date ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {format(new Date(record.date), "dd/MM/yyyy")}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={saveEdit}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelEdit}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <Select value={editingHours} onValueChange={setEditingHours}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">မဆင်းရဘူး</SelectItem>
                                <SelectItem value="2">၂ နာရီ</SelectItem>
                                <SelectItem value="4">၄ နာရီ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {format(new Date(record.date), "dd/MM/yyyy")}
                              </div>
                              <div className="text-primary font-semibold text-lg">
                                {getOTLabel(record.hours)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(record)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="w-4 h-4 text-primary" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(record.date)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OTTracker;
