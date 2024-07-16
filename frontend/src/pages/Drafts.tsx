import React, { useMemo, useCallback } from 'react';
import AppBar from '../components/AppBar';
import BlogCard from '../components/BlogCard';
import { useDrafts } from '../hooks/index';
import Skeleton from '../components/Skeleton';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { blogIdStore } from "../store/blogIdStore";

const Drafts: React.FC = () => {
    const { addDeletedId, deletedIds } = blogIdStore();
    const { loading, drafts: fetchedDrafts, currentPage, totalPages, nextPage, prevPage } = useDrafts();

    const drafts = useMemo(() => 
        fetchedDrafts.filter(draft => !deletedIds.includes(draft.id)),
        [fetchedDrafts, deletedIds]
    );

    const handleDelete = useCallback(async (draftId: string) => {
        addDeletedId(draftId);
    }, [addDeletedId]);

    if (loading) {
        return (
            <>
                <AppBar />
                <div className="max-w-7xl mx-auto px-5 sm:px-6">
                    <div className="pt-[9rem] flex flex-col gap-6">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </>
        )
    }
  
    return (
        <div className="pb-16">
            <AppBar />
            <div className="max-w-7xl mx-auto px-5 sm:px-6">
                {drafts.length > 0 ? (
                    <>
                        <div className="lg:flex-row flex-col md:flex-col flex justify-center items-center gap-[2rem] min-h-[70vh] mt-[9rem]">
                            {drafts.map((draft) => (
                                <BlogCard 
                                    blogId={draft.id}
                                    deleteIcon={true}
                                    to={`/draft/${draft.id}`}
                                    key={draft.id}
                                    authorName={"You"} 
                                    imageId={draft.imageId}
                                    title={draft.title} 
                                    content={draft.content} 
                                    publishedDate="Unpublished"
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 py-4 bg-white shadow-md">
                            <button 
                                onClick={prevPage} 
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-[#19191B] text-white rounded disabled:bg-gray-300"
                            >
                                <GoArrowLeft size={20} />
                            </button>
                            <span className="text-lg font-medium">{currentPage} of {totalPages}</span>
                            <button 
                                onClick={nextPage} 
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-[#19191B] text-white rounded disabled:bg-gray-300"
                            >
                                <GoArrowRight size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className='flex justify-center items-center pt-[16rem] font-medium text-3xl'>
                        NO DRAFTS FOUND
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drafts;