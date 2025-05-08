import { cn } from '@/lib/utils';

export default function Widget(classname, ...props) {
    const { bgColor, count, icon, title } = props;
    return (
        <div classname={cn('relative overflow-hidden border bg-white px-4 pb-6 pt-5 sm:pt-6', classname)}>
            <div>
                <div classname={cn('absolute rounded-2xl p-3', bgColor)}>{icon}</div>
                <p classname="ml-16 text-sm font-medium truncate text-muted-foreground">{title}</p>
            </div>
            <div classname="flex items-baseline ml-16">
                <p classname="text-2xl font-semibold text-foreground">{count}</p>
            </div>
        </div>
    );
}
