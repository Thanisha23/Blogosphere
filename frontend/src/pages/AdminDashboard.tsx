import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { isAdminStore } from '../store/isAdminStore';
interface User {
    id: string;
    name: string;
    email: string;
}

interface Blog {
    id: string;
    title: string;
    content:string;
    imageId:string;
    author: {
        name: string;
        email:string
    };
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const logout = isAdminStore(state => state.logout)
    const [users, setUsers] = useState<User[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        fetchUsers();
        fetchBlogs();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get<{ users: User[] }>(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error("Failed to fetch the users")
        }finally{
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        try {
            const response = await axios.get<{ blogs: Blog[] }>(`${import.meta.env.VITE_BACKEND_URL}/api/admin/blogs`);
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error("Failed to fetch blogs");
        }finally{
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/delete`, {
                    data: { userId },
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    },
                });

                if (response.data) {
                    fetchUsers();
                    fetchBlogs();
                    toast.success("Successfully deleted the user");
                } else {
                    toast.error("Failed to delete user");
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error("Error deleting the user");
            }
        }
    };

    const deleteBlog = async (blogId: string) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/blogs/delete`, {
                    data: { blogId },
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    },
                });
                if (response.data) {
                    fetchBlogs();
                    toast.success("Successfully deleted blog");
                } else {
                    toast.error("Failed to delete blog");
                }
            } catch (error) {
                console.error('Error deleting blog:', error);
                toast.error("Error deleting the blog");
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    const handleLogout = () => {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("userId");
          logout();
          navigate("/");
          toast.success("Logged out!", {
            position: "top-center"
          });
        } catch (error) {
          alert(`Error Logging out! ${error}`);
        }
      };
    return (
        <>
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Users</h2>
                    {users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {users.map(user => (
                                <li key={user.id} className="bg-white shadow rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-gray-600">{user.email}</p>
                                        </div>
                                        <button 
                                            onClick={() => deleteUser(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
                    {blogs.length === 0 ? (
                        <p>No blogs found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {blogs.map(blog => (
                                <li key={blog.id} className="bg-white shadow rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{blog.title}</h3>
                                            <p className="text-gray-600">by {blog.author.name}</p>
                                        </div>
                                        <button 
                                            onClick={() => deleteBlog(blog.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
};

export default AdminDashboard;