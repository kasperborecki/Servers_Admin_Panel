import apiFetch from "../utils/fetchWrapper";

export class CommentRepository {
  baseUrl = 'http://localhost:5052/api/Comments';

  async addComment(comment) {
    const body = {
      content: comment.content,
      createdAt: comment.createdAt,
      modifiedAt: comment.modifiedAt,
      taskId: comment.taskId,
    };

    return apiFetch(this.baseUrl, { method: 'POST', body });
  }

}
