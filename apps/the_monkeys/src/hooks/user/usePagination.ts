import { useRouter, useSearchParams } from "next/navigation";

export const usePagination = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const setPage = (newPage: number, options?: { replace?: boolean }) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", Math.max(0, newPage).toString());

        const url = `?${params.toString()}`;

        if (options?.replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    };

    return {
        page,
        next: () => setPage(page + 1),
        prev: () => setPage(page - 1),
        setPage,
    };
};