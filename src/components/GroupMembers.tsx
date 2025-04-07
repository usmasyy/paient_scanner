
import { Card, CardContent } from "@/components/ui/card";

const GroupMembers = () => {
  const members = [
    "ARMEELA",
    "MARYAM MURTAZA",
    "KAINAT ZAHID", 
    "IQRA ZUBAIR",
    "AREESHA BATOOL",
    "ESHA WAHAB",
    "USAMA HASSAN",
    "AYESHA SHAFIQ"
  ];

  return (
    <Card className="mb-8 bg-gradient-to-r from-violet-100 to-purple-50 border-violet-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-violet-800 mb-4">Group 2 Presentation</h2>
        <h3 className="font-semibold text-violet-700 mb-2">Team Members:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {members.map((member, index) => (
            <div key={index} className="bg-white p-2 rounded border border-violet-200 text-center">
              {member}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupMembers;
