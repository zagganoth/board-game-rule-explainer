import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { BellRing, Check } from 'lucide-react';

import React from 'react';
import { Badge } from '@/components/ui/badge';

const BoardGameCard = () => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl">
      <a href="#" target="_blank" rel="noopener noreferrer">
        <CardContent className="flex flex-row items-center gap-4 p-6">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Channel Logo" />
            <AvatarFallback>BG</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Board Game Name</h2>
            <Badge variant="secondary" className="text-xs">
              YouTube Channel
            </Badge>
          </div>
        </CardContent>
      </a>
    </Card>
  );
};

export default BoardGameCard;
