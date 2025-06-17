import { ActionDialog } from '@/Components/ActionDialog';
import { GetPriorityBadge } from '@/Components/GetPriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { PiCheckSquare, PiDotsThreeOutlineFill, PiLinkSimple, PiUser } from 'react-icons/pi';

export default function CardList({ card, workspace, handleDeleteCard }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    if (isDragging) {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border border-dashed border-muted-foreground p-2.5 text-left opacity-30"
            ></Card>
        );
    }
    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task relative cursor-grab rounded-xl hover:ring-2 hover:ring-inset hover:ring-red-500"
        >
            <CardHeader>
                <div className="flex items-center justify-between gap-x-4">
                    <CardTitle className="tracking-thigter line-clamp-2 text-base leading-relaxed">
                        <Link href={route('cards.show', [workspace, card])} className="hover:text-red-500">
                            {card.title}
                        </Link>
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <PiDotsThreeOutlineFill className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={route('cards.edit', [workspace, card])}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuGroup>
                                <ActionDialog
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                    }
                                    title="Delete Card"
                                    description="Are you sure you want to delete this card?"
                                    action={() => handleDeleteCard(card.id)}
                                />
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <GetPriorityBadge priority={card.priority} />
                </div>
                <CardDescription className="tracking-thigter line-clamp-4 leading-relaxed">
                    {card.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-8">
                    {card.has_task && (
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    <span className="p-1 font-medium text-red-500">{card.percentage}</span>
                                    of 100
                                </p>
                                <p className="text-sm text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.deadline > 0 ? (
                                        <span>{card.deadline} days left</span>
                                    ) : card.deadline == 0 ? (
                                        <span className="text-yellow-500">Today is deadline</span>
                                    ) : (
                                        <span className="text-red-500">overdue</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-x-4">
                                {card.has_task && (
                                    <div className="flex items-center gap-x-1" title={`${card.tasks_count} tasks`}>
                                        <PiCheckSquare className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                            {card.tasks_count}
                                            {/* Tasks */}
                                        </span>
                                    </div>
                                )}
                                {card.members_count > 1 && (
                                    <div className="flex items-center gap-x-1" title={`${card.members_count} members`}>
                                        <PiUser className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                            {card.members_count}
                                            {/* Members */}
                                        </span>
                                    </div>
                                )}
                                {card.has_attachment && (
                                    <div
                                        className="flex items-center gap-x-1"
                                        title={`${card.attachments_count} files attached`}
                                    >
                                        <PiLinkSimple className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs leading-relaxed tracking-tighter text-muted-foreground">
                                            {card.attachments_count}
                                            {/* Files */}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
