import type { SVGProps } from 'react';
import { Pill } from 'lucide-react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <Pill className="h-6 w-6" {...props} />
);
