import { GrowthBook } from '@growthbook/growthbook';

export async function getGrowthbook() {
  const growthbook = new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  });

  await growthbook.init({
    //enable streaming updates
    streaming: true,
  });

  return growthbook;
}

export function destroyGrowthbook(growthbook: GrowthBook) {
  growthbook.destroy();
}
