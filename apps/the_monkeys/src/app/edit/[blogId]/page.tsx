'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { PublishBlogDrawer } from '@/components/blog/actions/PublishBlogDrawer';
import { Loader } from '@/components/loader';
import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';
import { WSS_URL_V2 } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import useGetDraftBlogDetail, {
  DRAFT_BLOG_DETAIL_QUERY_KEY,
} from '@/hooks/blog/useGetDraftBlogDetail';
import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { OutputData } from '@editorjs/editorjs';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { twMerge } from 'tailwind-merge';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => (
    <div className='w-full'>
      <EditorBlockSkeleton />
    </div>
  ),
});

/* ------------------------------------------------------------------ */
/*  DEMO BLOG — Realistic blog using all 6 custom blocks               */
/*  See apps/the_monkeys/test-data/demo-blog-editorjs-data.md for      */
/*  a documented version with test instructions per field.             */
/*  To reset to empty editor, uncomment the block at the bottom.       */
/* ------------------------------------------------------------------ */

const INITIAL_DATA: OutputData = {
  time: Date.now(),
  blocks: [
    /* ---- Title ---- */
    {
      id: 'title',
      type: 'header',
      data: { text: 'Understanding Market Trends in Q1 2024', level: 1 },
    },

    /* ---- Intro ---- */
    {
      id: 'intro',
      type: 'paragraph',
      data: {
        text: 'In the first quarter of 2024, we observed significant shifts in consumer behaviour across our core product lines. This analysis breaks down the key trends, supporting data, and methodological approach behind our findings.',
      },
    },

    /* ---- Section: Revenue Trends ---- */
    {
      id: 'section-chart',
      type: 'header',
      data: { text: 'Revenue Across Product Lines', level: 2 },
    },
    {
      id: 'chart-intro',
      type: 'paragraph',
      data: {
        text: 'The chart below shows monthly revenue for our two flagship products across the first quarter. Product A saw steady growth after a dip in March, while Product B maintained a consistent upward trajectory.',
      },
    },
    {
      id: 'blk-chart',
      type: 'chart',
      data: {
        type: 'bar',
        title: 'Monthly Revenue — Products A & B',
        xLabel: 'Month',
        yLabel: 'Revenue (USD)',
        showLegend: true,
        palette: 'ocean',
        labels: ['January', 'February', 'March', 'April'],
        series: [
          { name: 'Product A', values: [12400, 19100, 16300, 21800] },
          { name: 'Product B', values: [8300, 11200, 14100, 18500] },
        ],
        source: 'manual',
      },
    },
    {
      id: 'chart-outro',
      type: 'paragraph',
      data: {
        text: 'By April, Product A had grown 75% from its January baseline, while Product B more than doubled. The convergence in April suggests our cross-sell initiative is gaining traction.',
      },
    },

    /* ---- Section: Trend Analysis ---- */
    {
      id: 'section-trend',
      type: 'header',
      data: { text: 'Month-over-Month Growth Trajectory', level: 2 },
    },
    {
      id: 'trend-intro',
      type: 'paragraph',
      data: {
        text: 'Looking at the combined growth rate across both products, the trend shows a clear upward trajectory. The sparkline below visualises the aggregated monthly performance.',
      },
    },
    {
      id: 'blk-trend',
      type: 'trend',
      data: {
        periodLabels: ['January', 'February', 'March', 'April', 'May (est.)'],
        values: [100, 118, 108, 132, 148],
        direction: 'up',
        percentChange: 48.0,
        delta: 48,
        summary:
          'Combined revenue index trended up by 48% over the observed period, indicating strong and sustained growth momentum across product lines.',
      },
    },
    {
      id: 'trend-outro',
      type: 'paragraph',
      data: {
        text: 'The slight dip in March (index: 108) corresponds to a seasonal slowdown observed in previous years. However, the April recovery surpassed pre-dip levels, confirming the underlying growth trend remains intact.',
      },
    },

    /* ---- Section: Formula ---- */
    {
      id: 'section-formula',
      type: 'header',
      data: { text: 'Calculating the Growth Rate', level: 2 },
    },
    {
      id: 'formula-intro',
      type: 'paragraph',
      data: {
        text: 'The compound monthly growth rate (CMGR) is calculated using the standard formula below. This gives us a normalised view of month-over-month performance.',
      },
    },
    {
      id: 'blk-formula',
      type: 'formula',
      data: {
        expression:
          '\\text{CMGR} = \\left( \\frac{V_f}{V_i} \\right)^{\\frac{1}{n}} - 1',
        mode: 'display',
        description:
          'Compound Monthly Growth Rate: Vf = final value, Vi = initial value, n = number of months',
      },
    },
    {
      id: 'formula-body',
      type: 'paragraph',
      data: {
        text: 'Applying this formula to our data: CMGR = (21800 / 12400)^(1/3) - 1 ≈ 0.207 or 20.7% monthly growth for Product A. This is well above our target of 15%.',
      },
    },

    /* ---- Section: Citation ---- */
    {
      id: 'section-citation',
      type: 'header',
      data: { text: 'Supporting Research', level: 2 },
    },
    {
      id: 'citation-intro',
      type: 'paragraph',
      data: {
        text: 'Our methodology draws on established frameworks for market analysis. A key reference is the work by Chen et al. on growth forecasting in SaaS markets:',
      },
    },
    {
      id: 'blk-citation',
      type: 'citation',
      data: {
        title:
          'Forecasting Growth in Subscription-Based Markets: A Machine Learning Approach',
        authors: 'Chen, L., Kumar, S., & Patel, R.',
        year: '2023',
        source: 'Journal of Marketing Analytics, 15(3), 212–234',
        identifier: 'DOI: 10.1234/jma.2023.01503',
        url: 'https://doi.org/10.1234/jma.2023.01503',
        citationText:
          'Chen, L., Kumar, S., & Patel, R. (2023). Forecasting Growth in Subscription-Based Markets: A Machine Learning Approach. Journal of Marketing Analytics, 15(3), 212–234. DOI: 10.1234/jma.2023.01503. https://doi.org/10.1234/jma.2023.01503',
      },
    },
    {
      id: 'citation-outro',
      type: 'paragraph',
      data: {
        text: 'The Chen et al. framework was particularly useful for normalising seasonal variations in our data. Their approach to handling multi-product cohorts directly informed our segmentation strategy.',
      },
    },

    /* ---- Section: Methodology ---- */
    {
      id: 'section-methodology',
      type: 'header',
      data: { text: 'Methodology', level: 2 },
    },
    {
      id: 'methodology-intro',
      type: 'paragraph',
      data: {
        text: 'To ensure reproducibility, we documented our analytical approach in detail. The methodology sections below cover the full pipeline from study design to limitations.',
      },
    },
    {
      id: 'blk-methodology',
      type: 'methodology',
      data: {
        studyDesign:
          "Retrospective cohort analysis of monthly transaction data from January to April 2024. The dataset includes all B2B and B2C transactions processed through the company's payment gateway. Products were analysed independently and as a combined portfolio.",
        dataCollection:
          "Data was extracted from the company's data warehouse (Snowflake) via SQL queries. The raw extract included 48,732 transaction records. Outliers (>3 standard deviations from the monthly mean) were flagged and reviewed manually; 14 records were excluded due to known data entry errors.",
        analysisMethod:
          'Descriptive statistics were computed for each product-month combination. Growth rates were calculated using the compound monthly growth rate (CMGR) formula. A paired t-test was used to compare month-over-month differences. All analysis was performed using Python 3.12 with pandas 2.1 and scipy 1.12.',
        assumptions:
          'Assumptions include: (1) transaction data is complete and accurately timestamped, (2) seasonal patterns from prior years apply to Q1 2024, (3) no significant pricing changes occurred during the analysis window, (4) outliers removed are genuinely erroneous and not indicative of real trends.',
        limitations:
          'Key limitations: (1) short observation window (4 months) limits trend reliability, (2) retrospective design cannot establish causality, (3) single-company data limits generalisability, (4) manual outlier review introduces subjectivity, (5) May figures are preliminary estimates and subject to revision.',
      },
    },

    /* ---- Section: Dataset ---- */
    {
      id: 'section-dataset',
      type: 'header',
      data: { text: 'Dataset Reference', level: 2 },
    },
    {
      id: 'dataset-intro',
      type: 'paragraph',
      data: {
        text: 'The full dataset used in this analysis is available for review. Below are the key metadata fields for traceability and reproducibility.',
      },
    },
    {
      id: 'blk-dataset',
      type: 'dataset',
      data: {
        title: 'Q1 2024 Revenue Transactions — Products A & B',
        source:
          'Company Data Warehouse (Snowflake) — internal.payments.transactions table',
        sampleSize:
          '48,732 transactions (14 excluded after outlier review = 48,718 analysed)',
        collectionDate:
          'Extracted 5 May 2024; covers 1 January – 30 April 2024',
        license:
          'Proprietary — Internal use only. Anonymised excerpts available on request.',
        variables:
          'transaction_id (PK), product_id (FK), amount_usd (float), transaction_date (date), customer_tier (varchar: B2B/B2C), payment_method (varchar), is_refunded (boolean)',
        notes:
          'All currency values are in USD. Refunded transactions were included in the raw count but excluded from revenue calculations. The outlier review was conducted by two analysts independently with 100% inter-rater agreement.',
      },
    },
    {
      id: 'dataset-outro',
      type: 'paragraph',
      data: {
        text: 'If you would like access to the anonymised dataset for verification or further analysis, please contact the data team.',
      },
    },

    /* ---- Conclusion ---- */
    {
      id: 'section-conclusion',
      type: 'header',
      data: { text: 'Conclusion', level: 2 },
    },
    {
      id: 'conclusion',
      type: 'paragraph',
      data: {
        text: 'Q1 2024 demonstrated strong growth across both product lines, with a combined trend increase of 48%. The CMGR analysis confirms this growth is above target. Our methodology and dataset are documented for full transparency. We will continue to monitor these trends in Q2 and provide a consolidated half-year report in July.',
      },
    },
  ],
};

/* ---- To reset to empty, uncomment this: ---- */
// const INITIAL_DATA: OutputData = {
//   time: Date.now(),
//   blocks: [
//     {
//       id: 'title',
//       type: 'header',
//       data: { text: 'Untitled Post', level: 1 },
//     },
//   ],
// };

const EditPage = ({ params }: { params: { blogId: string } }) => {
  const queryClient = useQueryClient();
  const blogId = params.blogId;
  const { data: session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('isNew') === 'true';

  const { blog, isLoading, isError } = useGetDraftBlogDetail(blogId, {
    enabled: !isNew,
  });

  // Refs for latest values
  const dataRef = useRef<OutputData | null>(null);
  const accountIdRef = useRef<string | undefined>();
  const blogTopicsRef = useRef<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [blogPublishLoading, setBlogPublishLoading] = useState(false);
  const [blogTopics, setBlogTopics] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  const [data, setData] = useState<OutputData | null>(
    isNew ? INITIAL_DATA : null
  );

  useEffect(() => {
    // route change should happen in a dedicated effect to avoid running between renders
    if (!isNew) return;

    // Clean up the URL so that subsequent refreshes perform a regular fetch
    const newUrl = window.location.pathname;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
  }, [isNew]);

  const accountId = session?.account_id;
  const username = session?.username;

  // Keep refs updated
  useEffect(() => {
    dataRef.current = data;
    accountIdRef.current = accountId;
    blogTopicsRef.current = blogTopics;
  }, [data, accountId, blogTopics]);

  // Get WebSocket token
  useEffect(() => {
    if (!session) return;

    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get('/auth/ws-token');
        setToken(response.data.token);
      } catch (error) {
        console.error('Failed to get WebSocket token:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description:
            'Failed to establish connection. Please refresh the page.',
        });
      }
    };

    fetchToken();

    // Refresh token every 5 minutes
    const tokenRefreshInterval = setInterval(fetchToken, 5 * 60 * 1000);

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [session]);

  // Format data
  const formatData = useCallback(
    (data: OutputData, accountId: string | undefined, blogTopics: string[]) => {
      const title = data?.blocks[0]?.data.text || 'No Title';
      const slug = generateSlug(title);
      const blogSlug = `${slug}-${blogId}`;

      return {
        owner_account_id: accountId,
        author_list: [accountId],
        content_type: 'editorjs',
        blog: {
          time: data?.time || Date.now(),
          blocks:
            data?.blocks?.map((block) => ({
              ...block,
              author: [accountId],
              time: Date.now(),
            })) || [],
        },
        tags: blogTopics,
        slug: blogSlug,
      };
    },
    [blogId]
  );

  // WebSocket management
  useEffect(() => {
    if (!token || !blogId) return;

    let isMounted = true;
    const MAX_RETRIES = 5;
    let retryCount = 0;

    const connectWebSocket = () => {
      if (!isMounted) return;

      if (webSocketRef.current) {
        webSocketRef.current.close();
      }

      setConnectionStatus('Connecting...');
      const ws = new WebSocket(
        `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
      );

      ws.onopen = () => {
        if (!isMounted) return;
        console.log('WebSocket connected \uD83D\uDFE2');
        setIsConnected(true);
        setConnectionStatus('Connected');
        retryCount = 0;

        // Send latest data on reconnect
        if (dataRef.current) {
          const formattedData = formatData(
            dataRef.current,
            accountIdRef.current,
            blogTopicsRef.current
          );
          ws.send(JSON.stringify(formattedData));
          setIsSaving(true);
        }
      };

      ws.onmessage = () => {
        setIsSaving(false);
        // Optional: Handle any incoming messages from server
      };

      ws.onclose = (event) => {
        if (!isMounted) return;
        console.log('WebSocket closed \uD83D\uDD34', event.code, event.reason);
        setIsConnected(false);
        setIsSaving(false);
        setConnectionStatus('Disconnected');

        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** retryCount, 30000);
          setConnectionStatus(
            `Reconnecting in ${Math.round(delay / 1000)}s...`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            retryCount++;
            connectWebSocket();
          }, delay);
        } else {
          setConnectionStatus('Connection failed. Please refresh the page.');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error \u2B55', error);
        ws.close();
      };

      webSocketRef.current = ws;
    };

    connectWebSocket();

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && token) {
        // Reconnect immediately when tab becomes visible
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, blogId, formatData, isConnected]);

  // Auto-save when data changes
  useEffect(() => {
    if (!data || !isConnected) return;

    const formattedData = formatData(data, accountId, blogTopics);

    try {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify(formattedData));
        setIsSaving(true);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setIsSaving(false);
    }
  }, [data, blogTopics, isConnected, accountId, formatData]);

  // Handle blog publishing
  const handlePublishStep = useCallback(async () => {
    if (!data || data.blocks.length <= 2) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Post must contain at least 3 content blocks.',
      });
      return;
    }

    if (data.blocks[0].type !== 'header' && data?.blocks[0].data.level !== 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Post should start with title (Heading 1).',
      });
      return;
    }

    const titleBlockCount = data.blocks.filter(
      (block) => block.type === 'title'
    ).length;
    if (titleBlockCount > 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Only one title block (Heading 1) is allowed in the post.',
      });
      return;
    }

    setBlogPublishLoading(true);

    try {
      await axiosInstance.post(
        `/blog/publish/${blogId}`,
        formatData(data, accountId, blogTopics)
      );

      toast({
        variant: 'success',
        title: 'Blog Published Successfully',
        description: 'Your post is now live!',
      });

      // Invalidate cache and redirect
      queryClient.invalidateQueries({
        queryKey: [DRAFT_BLOG_DETAIL_QUERY_KEY, blogId],
      });
      router.push(`/${username}`);
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Publishing Blog',
        description: 'There was an error while publishing. Please try again.',
      });
    } finally {
      setBlogPublishLoading(false);
    }
  }, [
    data,
    accountId,
    blogId,
    blogTopics,
    formatData,
    router,
    username,
    queryClient,
  ]);

  // Initialize editor data
  useEffect(() => {
    if (!isLoading) {
      if (blog && !data) {
        setData(blog.blog || INITIAL_DATA);
        setBlogTopics(blog.tags || []);
      } else if ((isError || !blog) && !data) {
        // Handle new draft or fetch error by providing blank slate
        setData(INITIAL_DATA);
        setBlogTopics([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog, isLoading, isError]);

  // Fetch draft blog data on mount
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [DRAFT_BLOG_DETAIL_QUERY_KEY, blogId],
    });
  }, [blogId, queryClient]);

  // Handle blog scheduling
  const handleScheduleStep = useCallback(
    async (scheduleTime: string, timezone: string) => {
      if (!data || data.blocks.length <= 2) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Post must contain at least 3 content blocks.',
        });
        return;
      }

      if (
        data.blocks[0].type !== 'header' &&
        data?.blocks[0].data.level !== 1
      ) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Post should start with title (Heading 1).',
        });
        return;
      }

      const titleBlockCount = data.blocks.filter(
        (block) => block.type === 'title'
      ).length;
      if (titleBlockCount > 1) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'Only one title block (Heading 1) is allowed in the post.',
        });
        return;
      }

      setBlogPublishLoading(true);

      try {
        const formatted = formatData(data, accountId, blogTopics);

        // Attempt to save latest changes via WS before scheduling
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
          webSocketRef.current.send(JSON.stringify(formatted));
        }

        const payload = {
          tags: formatted.tags,
          slug: formatted.slug,
          schedule_time: scheduleTime,
          timezone: timezone,
        };

        await axiosInstanceV2.post(`/blog/${blogId}/schedule_blog`, payload);

        toast({
          variant: 'success',
          title: 'Blog Scheduled Successfully',
          description: 'Your post has been scheduled!',
        });

        // Invalidate cache and redirect
        queryClient.invalidateQueries({
          queryKey: [DRAFT_BLOG_DETAIL_QUERY_KEY, blogId],
        });
        router.push(`/library?source=scheduled`);
      } catch (error) {
        console.error('Schedule error:', error);
        toast({
          variant: 'destructive',
          title: 'Error Scheduling Blog',
          description: 'There was an error while scheduling. Please try again.',
        });
      } finally {
        setBlogPublishLoading(false);
      }
    },
    [
      data,
      accountId,
      blogId,
      blogTopics,
      formatData,
      router,
      username,
      queryClient,
    ]
  );

  return (
    <>
      {isLoading ? (
        <div className='w-full'>
          <EditorBlockSkeleton />
        </div>
      ) : (
        <div className='relative min-h-screen'>
          <div className='pt-4 pb-3 flex justify-between items-center gap-2'>
            <div
              className={twMerge(
                'px-[10px] py-[1px] flex items-center gap-1 border-1 rounded-full',
                isConnected
                  ? 'border-alert-green/80 bg-alert-green/20'
                  : 'border-alert-red/80 bg-alert-red/20'
              )}
            >
              <div
                className={`inline-block size-2 rounded-full ${
                  isConnected ? 'bg-alert-green' : 'bg-alert-red'
                }`}
              />

              <p className='text-xs'>{isConnected ? 'Online' : 'Offline'}</p>
            </div>

            <div className='flex items-center gap-2'>
              <PublishBlogDrawer
                topics={blogTopics}
                setTopics={setBlogTopics}
                data={data}
                setData={setData}
                isPublishing={blogPublishLoading}
                handlePublish={handlePublishStep}
                handleSchedule={handleScheduleStep}
              />
            </div>
          </div>

          <div className='py-3'>
            <Suspense
              fallback={
                <div className='p-6 flex itemx-center'>
                  <Loader size={40} className='text-brand-orange' />
                </div>
              }
            >
              {data && (
                <Editor data={data} onChange={setData} blogId={blogId} />
              )}
            </Suspense>
          </div>

          {isSaving && (
            <div className='fixed left-1/2 -translate-x-1/2 bottom-[30px] p-2 z-50'>
              <div className='px-3 py-1 border-1 border-yellow-500/80 bg-yellow-500/50 rounded-full shadow-sm flex items-center gap-1'>
                <div
                  className={`inline-block size-2 rounded-full bg-yellow-500`}
                />

                <p className='text-xs sm:text-sm'>Saving...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditPage;
