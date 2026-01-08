'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { usePostQuery } from '@/hooks/usePostQuery';
import { PostDetailDto } from '@/types/post/post.dto';
import { useBanPost } from '@/hooks/useBanPost';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  // Fetch post data
  const { data, isLoading, isError } = usePostQuery(postId);
  const banPost = useBanPost();

  const post: PostDetailDto | undefined = data?.data;

  // Handle ban post
  const handleBanPost = async () => {
    if (confirm('Are you sure you want to ban this post?')) {
      try {
        await banPost.mutateAsync(postId);
        alert('Post banned successfully');
      } catch (error) {
        console.error('Error banning post:', error);
        alert('Failed to ban post');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading post details...
        </p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Post Not Found
        </h2>
        <Link href="/post">
          <Button variant="primary">Back to Post List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb />

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Post Details
        </h2>
        <div className="flex gap-3">
          <Link href="/post">
            <Button variant="outline">Back to List</Button>
          </Link>
          {post.isActive && (
            <Button
              variant="error"
              onClick={handleBanPost}
              disabled={banPost.isPending}
            >
              Ban Post
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Post Content Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 flex items-start gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <Image
                width={48}
                height={48}
                src={post.author.avatarUrl || '/images/user/user-01.png'}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h4 className="font-semibold text-gray-800 dark:text-white/90">
                  {post.author.name}
                </h4>
                {post.author.username && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    @{post.author.username}
                  </span>
                )}
                <Badge size="sm" color={post.isActive ? 'success' : 'error'}>
                  {post.isActive ? 'Active' : 'Banned'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Posted in</span>
                <Link
                  href={`/community/${post.community.id}`}
                  className="hover:text-brand-500 font-medium transition"
                >
                  {post.community.name}
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-5">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-white/90">
              {post.content}
            </p>
          </div>

          {/* Media Gallery */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {post.mediaUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    fill
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-lg">👁️</span>
              <span className="text-sm font-medium">
                {post.viewCount || 0} views
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-lg">❤️</span>
              <span className="text-sm font-medium">
                {post.likeCount || 0} likes
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">
                {post.commentCount || 0} comments
              </span>
            </div>
            {post.reportCount && post.reportCount > 0 && (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <span className="text-lg">🚨</span>
                <span className="text-sm font-medium">
                  {post.reportCount} reports
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Post Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Post Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Post ID
              </p>
              <p className="text-sm font-medium break-all text-gray-800 dark:text-white/90">
                {post.id}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {post.isActive ? 'Active' : 'Banned'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Author
              </p>
              <Link
                href={`/user-management/${post.author.id}`}
                className="hover:text-brand-500 text-sm font-medium text-gray-800 transition dark:text-white/90"
              >
                {post.author.name}
              </Link>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Community
              </p>
              <Link
                href={`/community/${post.community.id}`}
                className="hover:text-brand-500 text-sm font-medium text-gray-800 transition dark:text-white/90"
              >
                {post.community.name}
              </Link>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Last Updated
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(post.updatedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Media Files
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {post.mediaUrls?.length || 0} file(s)
              </p>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        {post.reports && post.reports.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Reports
              </h4>
              <Badge size="sm" color="warning">
                {post.reports.length}{' '}
                {post.reports.length === 1 ? 'report' : 'reports'}
              </Badge>
            </div>
            <div className="space-y-4">
              {post.reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="mb-1 font-medium text-gray-800 dark:text-white/90">
                        {report.reporterName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {report.reason && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Reason:</span>{' '}
                        {report.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
