import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { createGame, fetchGames, updateGame, deleteGame } from '../redux/Frontend Control/GameControl/GameControlAPI';
import { fetchSubOptions } from '../redux/Frontend Control/GameNavControl/subOptionSlice';
import { fetchMenuOptions } from '../redux/Frontend Control/GameNavControl/menuOptionSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 4px;
`;

const Container = styled.div`
  padding: 20px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogBox = styled.div`
  background: white;
  max-width: 500px;
  width: 90%;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6c757d;
  &:hover {
    color: #343a40;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const GameList = styled.div`
  margin-top: 20px;
`;

const GameCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const GameContent = styled.div`
  padding: 15px;
`;

const GameTitle = styled.h5`
  margin-bottom: 10px;
  font-size: 1.25rem;
`;

const GameLink = styled.a`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const GameControl = () => {
  const dispatch = useDispatch();
  const { subOptions } = useSelector((state) => state.subOption);
  const { menuOptions } = useSelector((state) => state.menuOption);
  const { gameControl, isLoading, isError, errorMessage, isSuccess } = useSelector(
    (state) => state.gameControl
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameName: '',
    nameBD: '',
    subOptionId: '',
    gameLink: '',
    imageFile: null,
    imageUrl: '',
    gameApiKey: '',
  });
  const [parentMenuTitle, setParentMenuTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingGameId, setEditingGameId] = useState(null);

  // List of available Game API Keys
  const gameApiKeys = [
    'Evolution API',
    'Exchange Betfair API',
    'Pragmatic Play API',
    'NetEnt API',
    'Red Tiger API',
    'PG - Soft API',
    'KA Gaming API',
    'Elbet API',
    'AGT Soft API',
    'SPRIBE API',
    'Playson API',
    'Jili API',
    'BTG Gaming API',
    'Turbo Game API',
    'Net Gaming API',
    'Ezugi API',
    'Sports API',
    'Sports Odds API',
    'Sports Live TV API',
    'Oracle Gaming API',
  ];

  // Fetch options and games on mount
  useEffect(() => {
    dispatch(fetchSubOptions());
    dispatch(fetchMenuOptions());
    dispatch(fetchGames());
  }, [dispatch]);

  // Update parent menu and main category when subOptionId changes
  useEffect(() => {
    const selectedSub = subOptions.find((sub) => sub._id === formData.subOptionId);
    if (selectedSub) {
      const parentMenu = menuOptions.find((menu) => menu._id === selectedSub.parentMenuOption);
      setParentMenuTitle(parentMenu?.title || '');
      setMainCategory(parentMenu?._id || '');
    } else {
      setParentMenuTitle('');
      setMainCategory('');
    }
  }, [formData.subOptionId, subOptions, menuOptions]);

  // Handle image upload
  const handleImageUpload = useCallback(async (file) => {
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(baseURL_For_IMG_UPLOAD, {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle image file change with dimension validation
  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      try {
        await new Promise((resolve, reject) => {
          img.onload = () => {
            if (img.naturalWidth !== 500 || img.naturalHeight !== 376) {
              // reject(
              //   new Error('Image must be exactly 500px wide and 376px tall.')
              // );
            }
            resolve();
          };
          img.onerror = () => reject(new Error('Failed to load image.'));
          img.src = objectUrl;
        });

        // If dimensions are valid, proceed with upload
        setFormData((prev) => ({ ...prev, imageFile: file }));
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl }));
        }
      } catch (error) {
        toast.error(error.message);
        // Clear the file input to allow re-selection
        e.target.value = null;
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    },
    [handleImageUpload]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { gameName, nameBD, subOptionId, gameLink, imageUrl, gameApiKey } = formData;

      if (!gameName || !nameBD || !subOptionId ) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Require image only for new games
      if (!editingGameId && !imageUrl) {
        toast.error('Please upload an image for the new game');
        return;
      }

      try {
        if (editingGameId) {
          const result = await dispatch(
            updateGame({
              id: editingGameId,
              data: {
                name: gameName,
                nameBD: nameBD,
                subOptions: subOptionId,
                link: gameLink,
                image: imageUrl,
                gameApiKey: gameApiKey || undefined, // Send undefined if empty to avoid storing empty string
              },
            })
          ).unwrap();

          if (result) {
            toast.success('Game updated successfully!');
          }
        } else {
          await dispatch(
            createGame({
              name: gameName,
              nameBD: nameBD,
              subOptions: subOptionId,
              link: gameLink,
              image: imageUrl,
              gameApiKey: gameApiKey || undefined, // Send undefined if empty to avoid storing empty string
            })
          ).unwrap();
          toast.success('Game created successfully!');
        }
        closeDialog();
        dispatch(fetchGames());
      } catch (error) {
        console.error('Failed to save game:', error);
        toast.error('Failed to save game. Please try again.');
      }
    },
    [dispatch, formData, editingGameId]
  );

  // Handle delete game
  const handleDeleteGame = useCallback(
    async (gameId) => {
      try {
        await dispatch(deleteGame(gameId)).unwrap();
        toast.success('Game deleted successfully!');
        dispatch(fetchGames());
      } catch (error) {
        console.error('Failed to delete game:', error);
        toast.error('Failed to delete game. Please try again.');
      }
    },
    [dispatch]
  );

  // Handle edit game
  const handleEditGame = (game) => {
    setEditingGameId(game._id);
    setFormData({
      gameName: game.name,
      nameBD: game.nameBD || '',
      subOptionId: game.subOptions?._id || '',
      gameLink: game.link,
      imageFile: null,
      imageUrl: game.image,
      gameApiKey: game.gameApiKey || '',
    });
    setIsDialogOpen(true);
  };

  // Handle dialog open/close
  const openDialog = () => {
    setEditingGameId(null);
    setFormData({
      gameName: '',
      nameBD: '',
      subOptionId: '',
      gameLink: '',
      imageFile: null,
      imageUrl: '',
      gameApiKey: '',
    });
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <Container className="container">
      <div className="d-flex justify-content-end">
        <AddButton className="btn btn-primary mb-3" onClick={openDialog}>
          <FaPlus /> {editingGameId ? 'Edit Game' : 'Add Game'}
        </AddButton>
      </div>

      {/* Game List Display */}
      <GameList className="row g-4">
        {isLoading && (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {isError && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {errorMessage || 'Failed to load games'}
            </div>
          </div>
        )}
        {isSuccess && gameControl?.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No games available. Add a new game!
            </div>
          </div>
        )}
        {gameControl?.map((game) => (
          <div key={game._id} className="col-md-6 col-lg-4">
            <GameCard className="card h-100">
              <GameImage
                src={`${baseURL_For_IMG_UPLOAD}s/${game.image}`}
                alt={game.name}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <GameContent>
                <GameTitle className="card-title">{game.name}</GameTitle>
                <p className="card-text">
                  Name (BD): {game.nameBD || 'Not specified'}
                </p>
                <p className="card-text">
                  Category: {game.subOptions?.title || 'Unknown'}
                </p>
                <p className="card-text">
                  Menu: {game.subOptions?.parentMenuOption?.title || 'Unknown'}
                </p>
                <p className="card-text">
                  API Key: {game.gameApiKey || 'Not specified'}
                </p>
                <GameLink href={game.link} target="_blank" rel="noopener noreferrer">
                  Play Now
                </GameLink>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditGame(game)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteGame(game._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </GameContent>
            </GameCard>
          </div>
        ))}
      </GameList>

      {/* Dialog for Adding/Editing Game */}
      {isDialogOpen && (
        <DialogOverlay onClick={closeDialog}>
          <DialogBox
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={closeDialog}>
              <FaTimes />
            </CloseButton>
            <h2 className="mb-4">{editingGameId ? 'Edit Game' : 'Add New Game'}</h2>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="gameName" className="form-label">
                  Game Name
                </label>
                <input
                  type="text"
                  id="gameName"
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="nameBD" className="form-label">
                  Name (BD)
                </label>
                <input
                  type="text"
                  id="nameBD"
                  name="nameBD"
                  value={formData.nameBD}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="subOptionId" className="form-label">
                  Game Category
                </label>
                <select
                  id="subOptionId"
                  name="subOptionId"
                  value={formData.subOptionId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Game Category</option>
                  {subOptions.map((sub) => {
                    const parentMenu = menuOptions.find(
                      (menu) => menu._id === sub.parentMenuOption
                    );
                    return (
                      <option key={sub._id} value={sub._id}>
                        {sub.title} (Parent: {parentMenu?.title || 'Unknown'})
                      </option>
                    );
                  })}
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="parentMenu" className="form-label">
                  Parent Menu Option
                </label>
                <input
                  type="text"
                  id="parentMenu"
                  value={parentMenuTitle}
                  className="form-control"
                  readOnly
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="gameLink" className="form-label">
                  Game Link
                </label>
                <input
                  type="url"
                  id="gameLink"
                  name="gameLink"
                  value={formData.gameLink}
                  onChange={handleInputChange}
                  className="form-control"
                
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="gameApiKey" className="form-label">
                  Game API Key (Optional)
                </label>
                <select
                  id="gameApiKey"
                  name="gameApiKey"
                  value={formData.gameApiKey}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Game API Key</option>
                  {gameApiKeys.map((apiKey) => (
                    <option key={apiKey} value={apiKey}>
                      {apiKey}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="gameImage" className="form-label">
                  Game Image (500px × 376px required)
                </label>
                {/* Display current image if editing */}
                {editingGameId && formData.imageUrl && (
                  <div>
                    <p>Current Image:</p>
                    <ImagePreview
                      src={`${baseURL_For_IMG_UPLOAD}s/${formData.imageUrl}`}
                      alt="Current game"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="gameImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                  disabled={isUploading}
                  required={!editingGameId}
                />
              </FormGroup>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUploading}
                >
                  {editingGameId ? 'Update Game' : 'Add Game'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDialog}
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogBox>
        </DialogOverlay>
      )}
    </Container>
  );
};

export default GameControl;