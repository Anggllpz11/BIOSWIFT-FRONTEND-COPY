// UserCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultUserImg from '../../pages/img/defaultUserImg.png';

interface UserCardProps {
  user: any;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const navigate = useNavigate();

  const navigateToUserDetail = (id: string) => {
    navigate(`/users/${id}`);
  };

  return (
    <div key={user._id} className='UsersPages-container-card'>
      <div className='UsersPages-card-section'>
        <ul className='UsersPages-cards-list'>
          <li>
            <a type='#' className='UsersPages-card' onClick={onClick}>
              <div className='UsersPages-card-cover'></div>
              <div className='UsersPages-card-overlay'>
                <div className='UsersPages-card-header'>
                  <img
                    src={DefaultUserImg}
                    className='UsersPages-card-UserImage'
                    alt=''
                    height='70px'
                    width='70px'
                  ></img>
                  <div className='UsersPages-card-header-text'>
                    <h3 className='UsersPages-card-title'>{user.name}</h3>
                    {user.roles.map((role: any) => (
                      <span key={role._id} className='UsersPages-card-status'>
                        {role.name}
                      </span>
                    ))}
                    <br></br>
                    <span className='UsersPages-card-status'># {user.number}</span>
                  </div>
                </div>
                <p className='UsersPages-card-description'>CC {user.cedula}</p>
                <p className='UsersPages-card-description'>{user.email}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserCard;
