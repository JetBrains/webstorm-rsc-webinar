'use client';

import { ChangeEvent, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';

export function AnimatedCardWithQuantity({
  id,
  name,
  imageUri,
  quantity,
  onClickMinus,
  onClickPlus
}: {
  id: string;
  name: string;
  imageUri: string;
  quantity: number;
  onClickPlus(id: string): void;
  onClickMinus(id: string): void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  return (
    <div className="relative">
      <div
        className={clsx(
          'absolute flex flex-col z-10 right-0 top-10',
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
      >
        <div
          className={clsx(
            'w-10 h-10 border-2 border-white/50 border-r-0 border-b-[1px] rounded-tl-md text-white flex justify-center items-center text-2xl tabular-nums bg-gray-600/90',
            'hover:cursor-pointer hover:bg-gray-400/90'
          )}
          onClick={() => startTransition(() => onClickPlus(id))}
        >
          +
        </div>
        <div
          className={
            'w-10 h-10 border-2 border-white/50 border-r-0 border-b-[1px] border-t-[1px] text-white flex justify-center items-center text-xl tabular-nums bg-gray-600/90'
          }
        >
          {quantity}
        </div>
        <div
          className={clsx(
            'w-10 h-10 border-2 border-white/50 border-r-0 border-t-[1px] rounded-bl-md text-white flex justify-center items-center text-2xl tabular-nums bg-gray-600/90',
            'hover:cursor-pointer hover:bg-gray-400/90'
          )}
          onClick={() => startTransition(() => onClickMinus(id))}
        >
          &ndash;
        </div>
      </div>
      <Image
        src={imageUri ?? ''}
        width={146 * 1.5}
        height={204 * 1.5}
        alt={name}
        className={clsx(
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}

export function Search() {
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (e.target.value) {
      searchParams.set('name', e.target.value);
    } else {
      searchParams.delete('name');
    }

    startTransition(() => {
      router.replace(`${pathname}?${searchParams.toString()}`);
    });
  };

  return (
    <div className="flex gap-x-4">
      <input
        type="text"
        className="border border-black rounded px-2 flex-1"
        onChange={onChange}
      />
      {isPending && <div className={'animate-spin'}>🔄</div>}
    </div>
  );
}
