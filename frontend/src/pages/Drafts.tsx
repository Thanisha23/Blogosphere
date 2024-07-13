import React from 'react';
import AppBar from '../components/AppBar';
import BlogCard from '../components/BlogCard';
import { useDrafts } from '../hooks/index';
import Skeleton from '../components/Skeleton';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

const Drafts: React.FC = () => {
    const { loading, drafts, currentPage, totalPages, nextPage, prevPage } = useDrafts();

    if (loading) {
        return (
            <>
                <AppBar />
                <div className="px-24 pt-[9rem] flex flex-col gap-6">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </>
        )
    }
  
    return (
        <div className="pb-16"> {/* Added padding-bottom to account for fixed pagination */}
            <AppBar />
            <div className="lg:flex-row flex-col md:flex-col flex justify-center items-center gap-[2rem] min-h-[70vh] mt-[3rem] mx-auto">
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
                        publishedDate={"2nd Feb 2024"} 
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
        </div>
    );
};

export default Drafts;