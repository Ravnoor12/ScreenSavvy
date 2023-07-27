import React, { useEffect, useState } from 'react'
import { BsTrash, BsPencilSquare } from 'react-icons/bs'
import Container from '../Container'
import CustomButtonLink from '../CustomButtonLink'
import RatingStar from '../RatingStar';
import { useParams } from 'react-router-dom';
import { deleteReview, getReviewByMovie } from '../../api/review'
import { useAuth, useNotification } from '../../hooks';
import ConfirmModal from '../modals/ConfirmModal';
import NotFoundText from '../NotFoundText';
import EditRatingModal from '../modals/EditRatingModal';

const getNameInitial = (name = '') => {
    return name[0].toUpperCase();
}

export default function MovieReviews() {
    const [reviews, setReviews] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [profileOwnersReview, setProfileOwndersReview] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [busy, setBusy] = useState(false);
    const { updateNotification } = useNotification();
    const { movieId } = useParams();
    const { authInfo } = useAuth();
    const profileId = authInfo.profile?.id;

    const fetchReviews = async () => {
        const { error, movie } = await getReviewByMovie(movieId);
        if (error) return updateNotification('error', error);
        setReviews([...movie.reviews]);
        setMovieTitle(movie.title);
    }

    const findProfileOwnersReview = () => {
        if (profileOwnersReview) return setProfileOwndersReview(null);
        const matched = reviews.find(review => review.owner.id === profileId)
        if (!matched) return updateNotification('error', 'You dont have any review!');
        setProfileOwndersReview(matched);
    }

    const handleOnEditClick = () => {
        const { id, content, rating } = profileOwnersReview
        setSelectedReview({
            id,
            content,
            rating
        });
        setShowEditModal(true)
    }

    const handleOnReviewUpdate = (review) => {
        const updatedReview = {
            ...profileOwnersReview,
            rating: review.rating,
            content: review.content,
        };
        setProfileOwndersReview({ ...updatedReview });
        const newReviews = reviews.map((r) => {
            if (r.id === updatedReview.id) return updatedReview;
            return r;
        });

        setReviews([...newReviews]);
    }

    const displayConfirmModal = () => setShowConfirmModal(true);
    const hideConfirmModal = () => setShowConfirmModal(false)
    const hideEditModal = () => {
        setShowEditModal(false)
        setSelectedReview(null);
    }

    const handleDeleteConfirm = async () => {
        setBusy(true);
        const { error, message } = await deleteReview(profileOwnersReview.id);
        setBusy(false);
        if (error) return updateNotification('error', error);
        updateNotification('success', message);
        const updateReviews = reviews.filter(r => r.id !== profileOwnersReview.id);
        setReviews([...updateReviews]);
        setProfileOwndersReview(null);
        hideConfirmModal();
    }

    useEffect(() => {
        if (movieId) fetchReviews();
    }, [movieId]);

    return (
        <div className='dark:bg-primary bg-white min-h-screen pb-10'>
            <Container className='xl:px-0 px-2 py-8'>
                <div className="flex justify-between items-center">
                    <h1 className='text-2xl font-semibold dark:text-white text-secondary'>
                        <span className='text-light-subtle dark:text-dark-subtle font-normal'>Reviews for: </span>
                        {movieTitle}
                    </h1>

                    {
                        profileId
                            ?
                            <CustomButtonLink
                                label=
                                {profileOwnersReview
                                    ?
                                    'View All' : 'Find my review'}
                                onClick={findProfileOwnersReview} />
                            : null
                    }
                </div>
                <NotFoundText text='No Reviews!' visible={!reviews.length} />
                {profileOwnersReview ?
                    <div>
                        <ReviewCard review={profileOwnersReview} />
                        <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
                            <button onClick={displayConfirmModal} type='button'>
                                <BsTrash />
                            </button>
                            <button type='button' onClick={handleOnEditClick}>
                                <BsPencilSquare />
                            </button>
                        </div>
                    </div>
                    :
                    (<div className="space-y-3 mt-3">
                        {reviews.map(review => <ReviewCard review={review} key={review.id} />)}
                    </div>)
                }
            </Container>
            <ConfirmModal
                visible={showConfirmModal}
                title='Are you sure'
                subtitle='This action will remove this review permanently'
                onCancel={hideConfirmModal}
                onConfirm={handleDeleteConfirm}
                busy={busy} />
            <EditRatingModal
                visible={showEditModal}
                initialState={selectedReview}
                onSuccess={handleOnReviewUpdate}
                onClose={hideEditModal} />
        </div>
    )
}


const ReviewCard = ({ review }) => {
    if (!review) return null;
    const { owner, content, rating } = review;
    return (
        <div className="flex space-x-3">
            <div className="flex items-center justify-center w-14 h-14 text-xl
                        rounded-full bg-light-subtle
                         dark:bg-dark-subtle text-white select-none">
                {getNameInitial(owner.name)}
            </div>
            <div>
                <h1 className='dark:text-white text-secondary font-semibold text-lg'>
                    {owner.name}
                </h1>
                <RatingStar rating={rating} />
                <p className='text-light-subtle dark:text-dark-subtle'>{content}</p>
            </div>
        </div>
    )
}