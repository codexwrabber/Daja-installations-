import Link from 'next/link';
import { Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined: boolean;
  onJoinToggle?: (id: string) => void;
}

export default function GroupCard({ id, name, description, memberCount, joined, onJoinToggle }: GroupCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          <Users className="h-5 w-5" />
        </span>
        <Button
          variant={joined ? 'secondary' : 'primary'}
          className="!px-3 !py-1.5 text-xs"
          onClick={() => onJoinToggle?.(id)}
          type="button"
        >
          {joined ? 'Joined' : 'Join'}
        </Button>
      </div>
      <Link href={`/groups/${id}`}>
        <h3 className="mt-3 font-semibold hover:text-brand-500">{name}</h3>
      </Link>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <p className="mt-3 text-xs text-muted">{memberCount} members</p>
    </Card>
  );
}
