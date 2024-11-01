import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        renewal_date: '',
        renewal_period: '',
        notes: '',
        currency: ''
    });
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        const response = await axios.get('http://localhost:3000/subscriptions');
        setSubscriptions(response.data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/subscriptions', formData);
        fetchSubscriptions();
        setFormData({ name: '', amount: '', renewal_date: '', renewal_period: '', notes: '', currency: '' });
        setIsFormVisible(false);
    };

    return (
        <div className="app-container">
            <h1>订阅管理平台</h1>
            <button className="add-button" onClick={() => setIsFormVisible(true)}>➕</button>
            {isFormVisible && (
                <form onSubmit={handleSubmit} className="subscription-form">
                    <input name="name" placeholder="订阅名称" value={formData.name} onChange={handleChange} required />
                    <input name="amount" placeholder="费用" value={formData.amount} onChange={handleChange} required />
                    <input name="renewal_date" type="date" value={formData.renewal_date} onChange={handleChange} required />
                    <select name="renewal_period" value={formData.renewal_period} onChange={handleChange} required>
                        <option value="">选择续费周期</option>
                        <option value="每月">每月</option>
                        <option value="每季度">每季度</option>
                        <option value="每年">每年</option>
                    </select>
                    <input name="notes" placeholder="备注" value={formData.notes} onChange={handleChange} />
                    <select name="currency" value={formData.currency} onChange={handleChange} required>
                        <option value="人民币">人民币</option>
                        <option value="美元">美元</option>
                    </select>
                    <button type="submit">添加订阅</button>
                </form>
            )}
            <ul className="subscription-list">
                {subscriptions.map(sub => (
                    <li key={sub.id}>
                        {sub.name} - {sub.amount} {sub.currency} - 续费日期: {new Date(sub.renewal_date).toLocaleDateString()} - 续费周期: {sub.renewal_period}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
