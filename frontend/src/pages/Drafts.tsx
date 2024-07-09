import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '../components/AppBar';
import BlogCard from '../components/BlogCard';
import Button from '../components/Button';
import { useDrafts } from '../hooks/index';

const Drafts: React.FC = () => {
    const { loading, drafts, currentPage, totalPages, nextPage, prevPage } = useDrafts();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pb-16">
            <AppBar />
            <div className="flex justify-between items-center px-24 py-4">
                <h1 className="text-2xl font-bold">My Drafts</h1>
                <Link to="/blogs">
                    <Button mode="dark" text="View All Blogs" />
                </Link>
            </div>
            <div className="lg:flex-row flex-col md:flex-col flex justify-center items-center gap-[2rem] min-h-[70vh] mt-[3rem] mx-auto">
                {drafts.map((draft) => (
                    <BlogCard 
                        key={draft.id}
                        id={draft.id} 
                        authorName="You"
                        imageId={draft.imageId}
                        title={draft.title} 
                        content={draft.content} 
                        publishedDate="Draft" 
                    />
                ))}
            </div>
            {drafts.length === 0 && <p className="text-center mt-8">You don't have any drafts yet.</p>}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button onClick={prevPage} disabled={currentPage === 1}>
                    <Button mode="light" text="Previous"  />
                    </button>
                    <span className="mx-4">Page {currentPage} of {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>
                    <Button mode="light" text="Next"  />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Drafts;